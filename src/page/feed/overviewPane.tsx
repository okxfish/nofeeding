import React, { useContext, useMemo, useCallback } from "react";
import {
  GroupedList,
  IGroup,
  IGroupRenderProps,
  IGroupHeaderProps,
  FontIcon,
  SelectionMode,
  Stack,
  Text,
  Label,
} from "@fluentui/react";
import OverviewCell from "./overviewCell";
import { useHistory } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { default as api } from "../../api";
import { default as get } from "lodash.get";
import { normalize, schema, NormalizedSchema } from "normalizr";
import { produce } from "immer";
import queryString from "query-string";
import { SystemStreamIDs } from "../../api/inoreader";
import { SettingContext } from "./../../context/setting";

export interface Props {
  className?: string;
}

export interface Subscription {
  id: string;
  title: string;
  iconUrl?: string;
  sortId: string;
}

interface subscriptionEntity {
  subscription: { [key: string]: Subscription };
}

const folder = new schema.Entity("folder");
const subscription = new schema.Entity("subscription", undefined);

const listItemClassName =
  "cursor-pointer items-center h-10 text-base flex hover:bg-gray-50 select-none";

const OverviewPane = ({ className }: Props) => {
  const history = useHistory();
  const commonPx = "px-2";
  const queryClient = useQueryClient();
  const { setting, setSetting } = useContext(SettingContext);

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

  const subscriptionsListQuery = useQuery<
    NormalizedSchema<subscriptionEntity, string[]>
  >(
    "home/subscriptionsListQuery",
    async () => {
      const subscriptionList = await api.inoreader.getSubscriptionList();
      const subscriptions = get(subscriptionList, "data.subscriptions");
      const subscriptionsNormalized = normalize<
        Subscription,
        subscriptionEntity
      >(subscriptions, [subscription]);
      return subscriptionsNormalized;
    },
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        entities: { subscription: {} },
        result: [],
      },
    }
  );

  const streamPreferencesQuery = useQuery(
    ["streamPreferences"],
    async () => {
      return api.inoreader.getStreamPreferenceList();
    },
    { refetchOnWindowFocus: false, retry: false }
  );

  const folderQuery = useQuery(
    ["home/folderQuery"],
    async () => {
      const res = await api.inoreader.getFolderOrTagList(1, 1);
      const tags = res.data.tags;
      const folders = tags.filter((tag) => tag.type === "folder");
      const foldersNormalized = normalize<any>(folders, [folder]);
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
        className={`${listItemClassName} ${commonPx} hover:bg-gray-200 rounded-sm`}
        style={{ paddingLeft: `${2 * (nestingDepth || 1)}rem` }}
        onClick={onClick}
      >
        {setting.subscription.isIconDisplay && (
          <img className="w-4 h-4 mr-2" src={item.iconUrl} alt="" />
        )}
        <Text block nowrap>
          {item.title}
        </Text>
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
            <Text block nowrap>
              {props.group!.name} ({props.group?.data.unreadCount})
            </Text>
          </div>
        );
      } else {
        return null;
      }
    },
  };

  const getListData = () => {
    const getSortIdToSubscriptionIdMap = () => {
      const result = {};
      const subscriptionsEntities = get(
        subscriptionsListQuery.data,
        "entities.subscription",
        {}
      );
      for (const id in subscriptionsEntities) {
        if (Object.prototype.hasOwnProperty.call(subscriptionsEntities, id)) {
          const subscription = subscriptionsEntities[id];
          result[subscription.sortid] = id;
        }
      }
      return result;
    };

    const streamPreferences = streamPreferencesQuery.data;

    if (!streamPreferences) {
      return null;
    }

    const sortIdToSubscriptionIdMap = getSortIdToSubscriptionIdMap();
    const getSubscriptionIdById = (sortId: string): string =>
      sortIdToSubscriptionIdMap[sortId];

    const subscriptionsIsGroupedMap = {};
    const subscriptionEntities = get(
      subscriptionsListQuery,
      "data.entities.subscription",
      {}
    );

    const result = folderQuery.data?.result.reduce(
      ({ amount, groups, items }: any, folderId: string) => {
        const foldEntity = get(
          folderQuery,
          `data.entities.folder['${folderId}']`
        );
        const idPartSplited: any[] = folderId.split("/");
        const name = idPartSplited[idPartSplited.length - 1];

        const subscriptionOrdering = get(
          streamPreferences,
          `data.streamprefs.['${folderId}'][1].value`,
          null
        );

        if (!subscriptionOrdering) {
          return null;
        }

        const subscriptions = subscriptionOrdering
          .match(/.{1,8}/g)
          .map((sortId: string): string => getSubscriptionIdById(sortId))
          .map((subscriptionId: string): Subscription => {
            subscriptionsIsGroupedMap[subscriptionId] = true;
            return subscriptionEntities[subscriptionId];
          });

        const count = subscriptions.length;
        items = items.concat(subscriptions);

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

    Object.keys(subscriptionsIsGroupedMap)
      .filter(
        (subscriptionId: string): boolean =>
          !subscriptionsIsGroupedMap[subscriptionId]
      )
      .forEach((subscriptionId: string): void => {
        result.items.push(subscriptionEntities[subscriptionId]);
      });

    return result;
  };

  const { groups, items } = getListData();

  return (
    <Stack className={`${className} min-h-0`}>
      <OverviewCell
        className={commonPx}
        iconProps={{ iconName: "PreviewLink" }}
        text="all"
        onClick={() => history.push("/feed")}
      />
      <OverviewCell
        className={commonPx}
        iconProps={{ iconName: "FavoriteStar" }}
        text="star"
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
      <Label className={`text-lg ${commonPx}`}>Folder</Label>
      <GroupedList
        className="flex-1 overflow-y-auto scrollbar-none"
        items={items || []}
        onRenderCell={onRenderCell}
        groupProps={groupProps}
        selectionMode={SelectionMode.none}
        groups={groups || []}
      />
    </Stack>
  );
};

export default OverviewPane;
