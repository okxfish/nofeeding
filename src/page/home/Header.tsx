import { useMemo, useContext } from "react";
import {
  Stack,
  ContextualMenuItemType,
  DirectionalHint,
  IContextualMenuProps,
  NeutralColors,
  Image,
  Text,
} from "@fluentui/react";
import SideBarButton from "./sideBarButton";
import queryString from "query-string";
import { DispatchContext, SettingContext } from "../../context";
import { UserInfoContext } from "./../../context/userInfo";
import { FeedThumbnailDisplayType, ViewType } from "../../context/setting";
import { useQueryClient, useIsFetching } from "react-query";
import { useHistory, useLocation, Switch, Route } from "react-router-dom";
import { get } from "lodash";
import { ModalKeys } from "../../reducer";
import { getTagNameFromId } from "./../feed/overviewPane";

const Header = () => {
  const {
    feed: { feedThumbnailDisplayType, unreadOnly },
  } = useContext(SettingContext);
  const dispatch = useContext(DispatchContext);
  const userInfo = useContext(UserInfoContext);
  const history = useHistory();
  const queryClient = useQueryClient();
  const location = useLocation();
  const qs = queryString.parse(location.search);
  const { streamId } = qs;
  const streamContentQueryKey = useMemo(
    () => ["feed/streamContentQuery", streamId, unreadOnly],
    [streamId, unreadOnly]
  );
  const isFeedFetching = useIsFetching(streamContentQueryKey);

  const subscriptionsList = queryClient.getQueryData(
    "home/subscriptionsListQuery"
  );

  const handleLogoffMenuItemClick = (e, item): void => {
    localStorage.removeItem("inoreaderToken");
  };

  const profileMenuProps: IContextualMenuProps = {
    alignTargetEdge: true,
    directionalHint: DirectionalHint.bottomAutoEdge,
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

  const handleBackBtnClick = () => {
    history.goBack();
  };

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
    directionalHint: DirectionalHint.bottomAutoEdge,
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
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: NeutralColors.black }}
                onClick={() => dispatch({ type: "CHANGE_TO_DARK_THEME" })}
              ></button>
              <button
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: NeutralColors.white }}
                onClick={() => dispatch({ type: "CHANGE_TO_LIGHT_THEME" })}
              ></button>
            </div>
          );
        },
        onClick: () => {},
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

  const subscription = get(
    subscriptionsList,
    `entities.subscription['${streamId}']`
  );

  const folderName =
    streamId && typeof streamId === "string"
      ? getTagNameFromId(streamId)
      : "all article";

  const name = subscription ? subscription.title : folderName;
  const feedType = subscription?.feedType;
  const iconUrl = subscription?.iconUrl;

  const iconRender = () => {
    if (feedType === "rss" && iconUrl) {
      return <Image src={iconUrl} className="mr-2" />;
    } else {
      return (
        <SideBarButton
          iconProps={{ iconName: "FolderHorizontal" }}
          className="text-lg mr-2"
        />
      );
    }
  };

  const handleSyncClick = () => {
    queryClient.refetchQueries(streamContentQueryKey);
  };

  return (
    <Stack
      horizontal
      verticalAlign="center"
      className="h-12 pr-4"
      style={{ flexShrink: 0 }}
    >
      <SideBarButton
        iconProps={{ iconName: "Back" }}
        className="w-12 h-12"
        onClick={handleBackBtnClick}
      />
      <Switch>
        <Route path="/settings" render={()=><Text className="text-lg">Settings</Text>}/>
        <Route
          path={["/", "/feed"]}
          render={() => (
            <>
              {iconRender()}
              <Text className="text-lg">{name}</Text>
            </>
          )}
        />
      </Switch>
      <div className="flex-1"></div>
      <SideBarButton
        iconProps={{ iconName: "Sync" }}
        title="sync feed"
        styles={{
          icon: isFeedFetching ? "fr-spin" : "",
        }}
        onClick={handleSyncClick}
      />
      <SideBarButton
        title="filter"
        className="block sm:hidden"
        iconProps={{ iconName: "Filter" }}
        onClick={() =>
          dispatch({ type: "OPEN_MODAL", modalKey: ModalKeys.OverViewPane })
        }
      />
      <SideBarButton
        title="subscript new feed "
        iconProps={{ iconName: "Add" }}
        onClick={() =>
          dispatch({ type: "OPEN_MODAL", modalKey: ModalKeys.AddFeedModal })
        }
      />
      <SideBarButton
        title="view setting"
        iconProps={{ iconName: "View" }}
        menuProps={menuProps}
        onClick={() =>
          dispatch({ type: "OPEN_MODAL", modalKey: ModalKeys.ViewSettingPane })
        }
      />
      <SideBarButton
        title="account"
        iconProps={{ iconName: "Contact" }}
        menuProps={profileMenuProps}
      />
    </Stack>
  );
};

export default Header;
