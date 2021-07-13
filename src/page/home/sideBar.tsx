import React, { SetStateAction, useContext, useMemo } from "react";
import {
  ContextualMenuItemType,
  DirectionalHint,
  IContextualMenuProps,
  IIconProps,
  Stack,
} from "@fluentui/react";
import { NeutralColors } from "@fluentui/theme";
import queryString from "query-string";

import { useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";

import SideBarItem from "./sideBarButton";

import { FeedThumbnailDisplayType, ViewType } from "../../context/setting";
import { CHANGE_VIEW_TYPE } from "../../App";
import { StoreContext } from "./../../context/app";
import {
  DispatchContext,
  UserInfoContext,
  SettingContext,
} from "../../context";

const filterIcon: IIconProps = { iconName: "Filter" };
const syncIcon: IIconProps = { iconName: "Sync" };
const contactIcon: IIconProps = { iconName: "Contact" };
const viewIcon: IIconProps = { iconName: "View" };

export interface Props {
  className?: string;
  setIsOverViewPaneOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsViewSettingPaneOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsAddFeedModalOpen: React.Dispatch<SetStateAction<boolean>>;
}

const useSelector = (selector: (store: any) => any) => {
  const store = useContext(StoreContext);
  const result = useMemo(() => selector(store), [store, selector]);
  return result;
};

const SideBar = ({
  className,
  setIsAddFeedModalOpen,
  setIsOverViewPaneOpen,
  setIsViewSettingPaneOpen,
}: Props) => {
  const {
    feed: { feedThumbnailDisplayType, unreadOnly },
  } = useContext(SettingContext);
  const dispatch = useContext(DispatchContext);
  const userInfo = useContext(UserInfoContext);

  const queryClient = useQueryClient();

  const location = useLocation();

  const qs = queryString.parse(location.search);
  const { streamId } = qs;

  const streamContentQueryKey = [
    "feed/streamContentQuery",
    streamId,
    unreadOnly,
  ];

  const setThumbnailDisplay = (e, item): void => {
    dispatch({ type: "CHANGE_THUMBNAIL_DISPLAY_TYPE", displayType: item?.key });
  };

  const handleViewTypeMenuItemClick = (e, item): void => {
    dispatch({ type: CHANGE_VIEW_TYPE, viewType: item.key });
  };

  const handleLogoffMenuItemClick = (e, item): void => {
    localStorage.removeItem("inoreaderToken");
  };

  const handleUnreadOnlyMenuItemClick = () => {
    dispatch({ type: "TOGGLE_UNREAD_ONLY" });
  };

  const handleFilterClick = () => {
    setIsOverViewPaneOpen(true);
  };

  const handleSyncClick = () => {
    queryClient.refetchQueries([
      "feed/streamContentQuery",
      streamId,
      unreadOnly,
    ]);
  };

  const handleViewSettingClick = () => {
    setIsViewSettingPaneOpen(true);
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
    directionalHint: DirectionalHint.rightTopEdge,
    items: [
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

  const profileMenuProps: IContextualMenuProps = {
    alignTargetEdge: true,
    directionalHint: DirectionalHint.rightTopEdge,
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

  const streamContentQuery = queryClient.getQueryState(streamContentQueryKey);

  return (
    <Stack
      className={className}
      style={{ backgroundColor: NeutralColors.gray30 }}
    >
      <SideBarItem
        title="filter"
        className="block sm:hidden"
        iconProps={filterIcon}
        onClick={handleFilterClick}
      />
      <SideBarItem
        title="view setting"
        className="hidden sm:block"
        iconProps={viewIcon}
        menuProps={menuProps}
        onClick={handleViewSettingClick}
      />
      <SideBarItem
        iconProps={syncIcon}
        title="sync feed"
        styles={{
          icon: streamContentQuery?.isFetching ? "fr-spin" : "",
        }}
        onClick={handleSyncClick}
      />
      <SideBarItem
        title="subscript new feed "
        iconProps={{ iconName: "Add" }}
        onClick={() => setIsAddFeedModalOpen(true)}
      />
      <SideBarItem
        className="hidden sm:block"
        title="account"
        iconProps={contactIcon}
        menuProps={profileMenuProps}
      />
    </Stack>
  );
};

export default React.memo(SideBar);
