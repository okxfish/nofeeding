import {
  default as React,
  useContext,
  useMemo,
} from "react";
import {
  CommandBar,
  ContextualMenuItemType,
  ICommandBarItemProps,
  Icon,
  IContextualMenuProps,
  NeutralColors,
  Stack,
  Text
} from "@fluentui/react";
import produce from "immer";
import api from "../../api";
import queryString from "query-string";
import {
  useQueryClient,
  useMutation,
  useIsFetching
} from "react-query";
import { useLocation } from "react-router";
import {
  DispatchContext,
  FeedContext,
  SettingContext
} from "../../context";
import { FeedThumbnailDisplayType, ViewType } from "../../context/setting";
import { ModalKeys } from "../../reducer";

import FeedPaneComponent from "./feedPaneComponent";
import { get } from "lodash";
import { getTagNameFromId } from "./overviewPane";

export interface Props {
  className?: string;
  getScrollParent(): any;
}

const FeedsPane = ({ className, getScrollParent }: Props) => {
  const { streamContentQuery, streamContentData } =
    useContext(FeedContext);
  const {
    feed: { feedThumbnailDisplayType, unreadOnly },
  } = useContext(SettingContext);

  const dispatch = useContext(DispatchContext);
  const queryClient = useQueryClient();

  const location = useLocation();
  const { streamId } = queryString.parse(location.search);

  const streamContentQueryKey = useMemo(
    () => ["feed/streamContentQuery", streamId, unreadOnly],
    [streamId, unreadOnly]
  );

  const markAllAsReadMutation = useMutation(
    async (streamId: string) => {
      return api.inoreader.markAllAsRead(streamId);
    },
    {
      onSuccess: () => {
        queryClient.setQueryData(
          streamContentQueryKey,
          produce((data) => {
            if (typeof data === "undefined" || !Array.isArray(data.pages)) {
              return null;
            }

            for (const page of data.pages) {
              if (page.entities.article) {
                for (const id of page.result) {
                  if (!page.entities.article[id].isRead) {
                    page.entities.article[id].isRead = true;
                  }
                }
              }
            }
          })
        );
      },
    }
  );

  const isFeedFetching = useIsFetching(streamContentQueryKey);

  const getThumbnailSwitchMenuItemProps = (key, text) => ({
    key,
    text,
    iconProps: {
      iconName: feedThumbnailDisplayType === key ? "RadioBtnOn" : "RadioBtnOff",
    },
    onClick: (e, item) =>
      dispatch({
        type: "CHANGE_THUMBNAIL_DISPLAY_TYPE",
        displayType: item?.key,
      }),
  });

  const getViewTypeMenuItemProps = (key, text, iconName) => ({
    key,
    text,
    iconProps: {
      iconName: iconName,
    },
    onClick: (e, item): void =>
      dispatch({ type: "CHANGE_VIEW_TYPE", viewType: item.key }),
  });

  const menuProps: IContextualMenuProps = {
    alignTargetEdge: true,
    items: [
      {
        key: "ThemeHeader",
        itemType: ContextualMenuItemType.Header,
        onRenderIcon: () => null,
        text: "Theme",
      },
      {
        key: "Theme",
        onRenderContent: () => {
          return (
            <div className="flex space-x-2">
              <button
                className="w-6 h-6 rounded-full border flex items-center justify-center text-white"
                style={{ backgroundColor: NeutralColors.black }}
                onClick={() => dispatch({ type: "CHANGE_TO_DARK_THEME" })}
              >
                D
              </button>
              <button
                className="w-6 h-6 rounded-full border flex items-center justify-center"
                style={{ backgroundColor: NeutralColors.white }}
                onClick={() => dispatch({ type: "CHANGE_TO_LIGHT_THEME" })}
              >
                L
              </button>
            </div>
          );
        },
      },
      {
        key: "Feed",
        itemType: ContextualMenuItemType.Header,
        onRenderIcon: () => null,
        text: "Feed",
      },
      {
        key: "UnreadOnly",
        text: "unread only",
        iconProps: {
          iconName: unreadOnly ? "CheckboxComposite" : "Checkbox",
        },
        onClick: () => dispatch({ type: "TOGGLE_UNREAD_ONLY" }),
      },
      {
        key: "Thumbnail",
        itemType: ContextualMenuItemType.Header,
        onRenderIcon: () => null,
        text: "Thumbnail",
      },
      getThumbnailSwitchMenuItemProps(
        FeedThumbnailDisplayType.alwaysDisplay,
        "aways"
      ),
      getThumbnailSwitchMenuItemProps(
        FeedThumbnailDisplayType.alwaysNotDisplay,
        "aways not"
      ),
      getThumbnailSwitchMenuItemProps(
        FeedThumbnailDisplayType.displayWhenThumbnaillExist,
        "auto"
      ),
      {
        key: "Views",
        itemType: ContextualMenuItemType.Header,
        onRenderIcon: () => null,
        text: "Views",
      },
      getViewTypeMenuItemProps(ViewType.card, "card view", "GridViewMedium"),
      getViewTypeMenuItemProps(ViewType.list, "list view", "GroupedList"),
      getViewTypeMenuItemProps(
        ViewType.threeway,
        "split view",
        "ColumnRightTwoThirds"
      ),
    ],
  };

  const handleSyncClick = () => {
    queryClient.refetchQueries(streamContentQueryKey);
  };

  const overflowItems: ICommandBarItemProps[] = [];
  const commandItems: ICommandBarItemProps[] = [
    // {
    //   iconProps: { iconName: "CheckList" },
    //   iconOnly: true,
    //   key: "markAllAsRead",
    //   text: "Mark All As Read",
    //   onClick: () => markAllAsReadMutation.mutate(String(streamId)),
    // },
    {
      iconProps: { iconName: "Sync" },
      iconOnly: true,
      styles: {
        icon: isFeedFetching ? "fr-spin" : "",
      },
      key: "sync",
      icon: "Sync",
      text: "Sync",
      onClick: handleSyncClick,
    }, {
      key: "view",
      text: "View",
      iconOnly: true,
      iconProps: { iconName: "View" },
      subMenuProps: menuProps,
      onClick: () =>
        dispatch({ type: "OPEN_MODAL", modalKey: ModalKeys.ViewSettingPane }),
    },
  ]

  const subscriptionsList = queryClient.getQueryData(
    "home/subscriptionsListQuery"
  );

  const subscription = get(
    subscriptionsList,
    `entities.subscription['${streamId}']`
  );

  const folderName =
    streamId && typeof streamId === "string"
      ? getTagNameFromId(streamId)
      : "All article";

  const name = subscription ? subscription.title : folderName;

  return (
    <>
      <Stack className="px-6 py-2 sticky top-0 z-10" horizontal verticalAlign="center" style={{backgroundColor: 'inherit'}}>
        <Stack
          horizontal
          verticalAlign="center"
          className="space-x-2 flex sm:hidden"
          onClick={() =>
            dispatch({
              type: "OPEN_MODAL",
              modalKey: ModalKeys.OverViewPane,
            })
          }
        >
          <Text className="text-xl flex-1" block nowrap>
            {name}
          </Text>
          <Icon iconName="ChevronDown" />
        </Stack>
        <Text className="text-xl font-semibold flex-1 hidden sm:block" block nowrap>
          {name}
        </Text>
        <CommandBar
          className="flex flex-1 justify-end p-0"
          styles={{root: 'p-0'}}
          items={commandItems}
          overflowItems={overflowItems}
        />
      </Stack>
      <FeedPaneComponent
        className={className}
        items={streamContentData}
        hasNextPage={streamContentQuery.hasNextPage}
        isFetching={streamContentQuery.isFetching}
        fetchNextPage={streamContentQuery.fetchNextPage}
        getScrollParent={getScrollParent}
      />
    </>
  );
};

export default React.memo(FeedsPane);
