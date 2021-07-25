import { useState, useMemo, useEffect, useContext } from "react";
import { useWindowSize } from "react-use";
import {
  Stack,
  Modal,
  ContextualMenuItemType,
  DirectionalHint,
  IContextualMenuProps,
  NeutralColors,
  Image,
  Text,
} from "@fluentui/react";
import queryString from "query-string";
import { default as FeedPage } from "../feed";
import OverviewPane from "../feed/overviewPane";
import ViewSettingPane from "./viewSettingPane";
import AddFeed from "./AddFeed";
import HelfScreenPanel from "../../component/halfScreenPanel/halfScreenPanel";
import { CHANGE_VIEW_TYPE } from "../../App";
import { DispatchContext, SettingContext } from "../../context";
import SideBarButton from "./sideBarButton";
import { UserInfoContext } from "./../../context/userInfo";
import { FeedThumbnailDisplayType, ViewType } from "../../context/setting";
import { useQueryClient, useIsFetching } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { get } from "lodash";
import { getTagNameFromId } from "./../feed/overviewPane";

const Home = () => {
  const {
    layout: { viewType },
    feed: { feedThumbnailDisplayType, unreadOnly },
    isDarkMode,
  } = useContext(SettingContext);
  const dispatch = useContext(DispatchContext);
  const userInfo = useContext(UserInfoContext);
  const history = useHistory();

  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState<boolean>(false);
  const [isViewSettingPaneOpen, setIsViewSettingPaneOpen] =
    useState<boolean>(false);

  const { height: windowHeight, width } = useWindowSize();

  useEffect(() => {
    if (viewType === ViewType.threeway && width < 1280) {
      dispatch({ type: CHANGE_VIEW_TYPE, viewType: ViewType.card });
    }
  }, [viewType, width, dispatch]);

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

  const setThumbnailDisplay = (e, item): void => {
    dispatch({ type: "CHANGE_THUMBNAIL_DISPLAY_TYPE", displayType: item?.key });
  };

  const handleViewTypeMenuItemClick = (e, item): void => {
    dispatch({ type: CHANGE_VIEW_TYPE, viewType: item.key });
  };

  const handleUnreadOnlyMenuItemClick = () => {
    dispatch({ type: "TOGGLE_UNREAD_ONLY" });
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
    onClick: setThumbnailDisplay,
  });

  const getViewTypeMenuItemProps = (key, text, iconName) => ({
    key,
    text,
    iconProps: {
      iconName: iconName,
    },
    onClick: handleViewTypeMenuItemClick,
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
        onClick: handleUnreadOnlyMenuItemClick,
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

  const handleViewSettingClick = () => {
    setIsViewSettingPaneOpen(true);
  };

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

  const handleFilterClick = () => {
    setIsOverViewPaneOpen(true);
  };

  return (
    <Stack
      style={{
        height: windowHeight,
      }}
      className="w-full"
    >
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
        {iconRender()}
        <Text className="text-lg">{name}</Text>
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
          onClick={handleFilterClick}
        />
        <SideBarButton
          title="subscript new feed "
          iconProps={{ iconName: "Add" }}
          onClick={() => setIsAddFeedModalOpen(true)}
        />
        <SideBarButton
          title="view setting"
          iconProps={{ iconName: "View" }}
          menuProps={menuProps}
          onClick={handleViewSettingClick}
        />
        <SideBarButton
          title="account"
          iconProps={{ iconName: "Contact" }}
          menuProps={profileMenuProps}
        />
      </Stack>
      <Stack className="overflow-y-hidden flex-col sm:flex-row">
        <Stack
          className={`sm:space-y-2 z-50 sm:w-12 flex-row sm:flex-col order-last sm:order-first`}
          horizontalAlign="center"
        >
          <div className='flex-1'></div>
          <SideBarButton
            iconProps={{ iconName: "Settings" }}
            title="Settings"
          />
        </Stack>
        <Stack
          horizontal
          className="overflow-y-hidden flex-1 space-x-2 pr-4"
          role="main"
        >
          <FeedPage />
        </Stack>
      </Stack>
      <Modal
        isOpen={isAddFeedModalOpen}
        isBlocking={false}
        onDismiss={() => setIsAddFeedModalOpen(false)}
      >
        <AddFeed onCancel={() => setIsAddFeedModalOpen(false)} />
      </Modal>
      <HelfScreenPanel
        isOpen={isOverViewPaneOpen}
        isLightDismiss
        hasCloseButton={false}
        onDismiss={() => setIsOverViewPaneOpen(false)}
        onLightDismissClick={() => setIsOverViewPaneOpen(false)}
        styles={{ content: "p-0" }}
      >
        <OverviewPane />
      </HelfScreenPanel>
      <HelfScreenPanel
        isOpen={isViewSettingPaneOpen}
        isLightDismiss
        hasCloseButton={false}
        onDismiss={() => setIsViewSettingPaneOpen(false)}
        onLightDismissClick={() => setIsViewSettingPaneOpen(false)}
      >
        <ViewSettingPane />
      </HelfScreenPanel>
    </Stack>
  );
};

export default Home;
