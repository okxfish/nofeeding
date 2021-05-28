import React from "react";
import {
  GroupedList,
  IGroupRenderProps,
  IGroupHeaderProps,
  CommandBarButton,
  IIconProps,
  FontIcon,
  SelectionMode,
  IContextualMenuProps,
} from "office-ui-fabric-react";
import OverviewCell from "./overviewCell";
import { useHistory } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { default as api } from "../../api";
import { default as get } from "lodash.get";
import { normalize, schema } from "normalizr";
import { IGroup } from "@fluentui/react";
import { produce } from "immer";
import queryString from "query-string";
import { SystemStreamIDs } from "../../api/inoreader";

export interface Props {
  className?: string;
}

const folder = new schema.Entity("folder");
const subscription = new schema.Entity("subscription", undefined, {
  idAttribute: "sortid",
});

const listItemClassName =
  "cursor-pointer items-center h-10 text-base flex hover:bg-gray-50 select-none";

const moreIcon: IIconProps = { iconName: "More" };

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: "renameFolder",
      text: "rename",
      iconProps: { iconName: "Edit" },
    },
  ],
};

const OverviewPane = ({ className }: Props) => {
  const history = useHistory();
  const commonPx = "px-2";
  const queryClient = useQueryClient();

  const setSubscriptionDataById = (streamId: string, updater: any): void =>
    queryClient.setQueryData(
      ["home/subscriptionsListQuery"],
      produce((data) => {
        const subscription = get(data, `entities.subscription['${streamId}']`);
        updater(subscription);
      })
    );

  const setFolderDataById = (folderId: string, updater: any): void =>
    queryClient.setQueryData(
      ["home/folderQuery"],
      produce((data) => {
        const folder = get(data, `entities.folder['${folderId}']`);
        updater(folder);
      })
    );

  const subscriptionsListQuery = useQuery(
    "home/subscriptionsListQuery",
    async () => {
      const subscriptionList = await api.inoreader.getSubscriptionList();
      const subscriptions = get(subscriptionList, "data.subscriptions");
      const subscriptionsNormalized = normalize<any>(subscriptions, [
        subscription,
      ]);
      return subscriptionsNormalized;
    },
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        entities: {},
        result: [],
      },
    }
  );

  const folderQuery = useQuery(
    "home/folderQuery",
    async () => {
      const res = await Promise.all([
        api.inoreader.getFolderOrTagList(1, 1),
        api.inoreader.getStreamPreferenceList(),
      ]);
      const tags = res[0].data.tags;
      const folders = tags.filter((tag) => tag.type === "folder");
      const foldersNormalized = normalize<any>(folders, [folder]);
      const streamPreferences = res[1].data.streamprefs;
      foldersNormalized.result.forEach((folderId) => {
        const subscriptionOrdering = get(
          streamPreferences,
          `['${folderId}'][1].value`,
          ""
        );
        const subscriptions = subscriptionOrdering.match(/.{1,8}/g);
        const folder = get(foldersNormalized, `entities.folder['${folderId}']`);
        folder.subscriptions = subscriptions;
        folder.isCollapsed = false;
      });
      return foldersNormalized;
    },
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        entities: {},
        result: [],
      },
    }
  );

  const onRenderCell = (
    nestingDepth?: number,
    item?: any,
    itemIndex?: number
  ): React.ReactNode => {
    const onClick = (e: any) => {
      history.push({
        pathname: "/feed",
        search: `streamId=${item.id}`,
      });
      if (typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
    };
    return item && typeof itemIndex === "number" && itemIndex > -1 ? (
      <div
        className={`${listItemClassName} hover:bg-gray-200 rounded-sm`}
        style={{ paddingLeft: `${2 * (nestingDepth || 1)}rem` }}
        onClick={onClick}
      >
        <img className="w-4 h-4 mr-2" src={item.iconUrl} alt="" />
        <div className="truncate">{item.title}</div>
      </div>
    ) : null;
  };

  const groupProps: IGroupRenderProps = {
    onRenderHeader: (props?: IGroupHeaderProps): JSX.Element | null => {
      if (props && props.group) {
        const toggleCollapse = (): void => {
          setFolderDataById(props.group?.data.id, (folder) => {
            folder.isCollapsed = !folder.isCollapsed;
          });
        };

        return (
          <div
            className={`${listItemClassName} ${commonPx} hover:bg-gray-200 rounded-sm`}
            onClick={toggleCollapse}
          >
            <FontIcon
              className={`mr-2 transition-all transform ${
                props.group!.isCollapsed ? "" : "rotate-90"
              }`}
              iconName="ChevronRight"
            />
            <span className="flex-1">
              {props.group!.name} ({props.group?.data.unreadCount})
            </span>
            <CommandBarButton
              className="bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none min-w-0"
              menuProps={menuProps}
              iconProps={moreIcon}
              onRenderMenuIcon={() => null}
            />
          </div>
        );
      } else {
        return null;
      }
    },
  };

  const { groups, items }: { amount: number; groups: IGroup[]; items: any[] } =
    folderQuery.data?.result.reduce(
      ({ amount, groups, items }: any, folderId: string) => {
        const foldEntity = get(
          folderQuery,
          `data.entities.folder['${folderId}']`
        );
        const idPartSplited: any[] = folderId.split("/");
        const name = idPartSplited[idPartSplited.length - 1];
        const count = foldEntity.subscriptions.length;
        items = items.concat(
          foldEntity.subscriptions.map((subscriptionsId) =>
            get(
              subscriptionsListQuery,
              `data.entities.subscription['${subscriptionsId}']`
            )
          )
        );

        groups.push({
          key: foldEntity?.id,
          name: name,
          count: count,
          startIndex: amount,
          isCollapsed: foldEntity.isCollapsed,
          data: {
            unreadCount: foldEntity.unread_count,
            id: foldEntity?.id,
          },
        });
        return { amount: amount + count, groups, items };
      },
      { amount: 0, groups: [], items: [] }
    );

  return (
    <div className={`${className} flex-1 flex flex-col min-h-0 cursor-pointer`}>
      <OverviewCell
        className={`${commonPx}`}
        iconProps={{ iconName: "PreviewLink" }}
        content="all"
        onClick={() => history.push("/feed")}
      />
      <OverviewCell
        className={`${commonPx}`}
        iconProps={{ iconName: "FavoriteStar" }}
        content="star"
        onClick={() =>
          history.push({
            pathname: "/feed",
            search: queryString.stringify({
              streamId: SystemStreamIDs.STARRED,
              unreadOnly: "0",
            }),
          })
        }
      />
      <OverviewCell
        className={`${commonPx} bg-gray-50 rounded-t-lg rounded-b-none sm:bg-transparent sm:rounded-b-sm sm:rounded-t-sm`}
        iconProps={{ iconName: "Source" }}
        content="source"
        onFooterRender={() => (
          <CommandBarButton
            className="bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none min-w-0"
            menuProps={menuProps}
            iconProps={moreIcon}
            onRenderMenuIcon={() => null}
          />
        )}
      />
      <GroupedList
        className="flex-1 border-b border-t overflow-y-auto scrollbar-none bg-gray-50 sm:bg-transparent"
        items={items || []}
        onRenderCell={onRenderCell}
        groupProps={groupProps}
        selectionMode={SelectionMode.none}
        groups={groups || []}
      />
    </div>
  );
};

export default OverviewPane;
