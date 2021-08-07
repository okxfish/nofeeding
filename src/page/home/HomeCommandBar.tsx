import { useMemo, useContext } from "react";
import {
  CommandBar,
  ContextualMenuItemType,
  IContextualMenuProps,
  ICommandBarItemProps,
  ICommandBarProps,
  NeutralColors,
  ICommandBarStyles,
  ICommandBarStyleProps,
  IStyleFunctionOrObject,
} from "@fluentui/react";
import { SettingContext } from "../../context";
import { useMutation, useQueryClient } from "react-query";
import { UserInfoContext } from "./../../context/userInfo";
import { useHistory, useLocation } from "react-router-dom";
import { FeedThumbnailDisplayType, ViewType } from "../../context/setting";
import { useIsFetching } from "react-query";
import { DispatchContext } from "../../context";
import queryString from "query-string";
import { ModalKeys } from "../../reducer";
import api from "../../api";
import produce from "immer";

interface Props {
  className?: string;
  styles?: IStyleFunctionOrObject<ICommandBarStyleProps, ICommandBarStyles>;
}

const HomeCommandBar = ({ className, styles }: Props) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const history = useHistory();
  const {
    feed: { feedThumbnailDisplayType, unreadOnly },
  } = useContext(SettingContext);
  const dispatch = useContext(DispatchContext);
  const userInfo = useContext(UserInfoContext);
  const qs = queryString.parse(location.search);
  const { streamId } = qs;

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

  const handleLogoffMenuItemClick = (e, item): void => {
    localStorage.removeItem("inoreaderToken");
    history.replace("/login");
  };

  const profileMenuProps: IContextualMenuProps = {
    alignTargetEdge: true,
    items: [
      {
        key: "userName",
        text: userInfo?.userName,
        iconProps: { iconName: "Contact" },
      },
      {
        key: "logoff",
        text: "logoff",
        iconProps: { iconName: "SignOut" },
        onClick: handleLogoffMenuItemClick,
      },
    ],
  };

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

  const commandItems: ICommandBarItemProps[] = [
    {
      iconProps: { iconName: "CheckList" },
      iconOnly: true,
      key: "markAllAsRead",
      text: "Mark All As Read",
      onClick: () => markAllAsReadMutation.mutate(String(streamId)),
    },
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
    },
    {
      key: "newFeed",
      text: "Add Subscript",
      iconOnly: true,
      iconProps: { iconName: "Add" },
      onClick: () =>
        dispatch({ type: "OPEN_MODAL", modalKey: ModalKeys.AddFeedModal }),
    },
    {
      key: "view",
      text: "View",
      iconOnly: true,
      iconProps: { iconName: "View" },
      subMenuProps: menuProps,
      onClick: () =>
        dispatch({ type: "OPEN_MODAL", modalKey: ModalKeys.ViewSettingPane }),
    },
    {
      key: "Contact",
      text: "Account",
      iconOnly: true,
      iconProps: { iconName: "Contact" },
      subMenuProps: profileMenuProps,
    },
    {
      key: "settings",
      iconOnly: true,
      text: "Settings",
      iconProps: { iconName: "Settings" },
      onClick: () => history.push("/settings"),
    },
  ];

  const overflowItems: ICommandBarItemProps[] = [];

  return (
    <CommandBar
      className={className}
      items={commandItems}
      overflowItems={overflowItems}
      styles={styles}
    />
  );
};

export default HomeCommandBar;
