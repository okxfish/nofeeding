import {
  ContextualMenuItemType,
  DirectionalHint,
  IContextualMenuProps,
  IIconProps,
  Toggle,
} from "@fluentui/react";
import { NeutralColors } from '@fluentui/theme'
import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import SideBarItem from "./sideBarItem";
import classnames from "classnames";
import queryString from "query-string";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };
const filterIcon: IIconProps = { iconName: "Filter" };
const homeIcon: IIconProps = { iconName: "Home" };
const syncIcon: IIconProps = { iconName: "Sync" };
const contactIcon: IIconProps = { iconName: "Contact" };
const cancelIcon: IIconProps = { iconName: "Cancel" };
const viewIcon: IIconProps = { iconName: "View" };

export interface Props {
  className?: string;
  setIsOverViewPaneOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsViewSettingPaneOpen: React.Dispatch<SetStateAction<boolean>>;
}

const SideBar = ({
  className,
  setIsOverViewPaneOpen,
  setIsViewSettingPaneOpen,
}: Props) => {
  const [isSidePaneOpen, setIsSidePaneOpen] = useState<boolean>(false);
  const [isLoaddingFeeds, setIsLoaddingFeeds] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    let timeout;
    if (isLoaddingFeeds) {
      timeout = setTimeout(() => setIsLoaddingFeeds(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isLoaddingFeeds]);

  const { setViewType } = useContext(ViewTypeContext);

  const history = useHistory();
  const location = useLocation();

  const toggleSidePane = (): void => setIsSidePaneOpen(!isSidePaneOpen);

  const handleFeedClick = () => {
    history.replace("/feed");
  };

  const handleFilterClick = () => {
    setIsOverViewPaneOpen(true);
  };

  const handleSyncClick = () => {
    setIsLoaddingFeeds(true);
  };

  const handleProfileClick = async () => {};

  const handleHamburgerMenuBtnClick = () => {
    toggleSidePane();
  };

  const menuProps: IContextualMenuProps = {
    alignTargetEdge: true,
    directionalHint: DirectionalHint.rightTopEdge,
    items: [
      {
        key: "UnreadOnly",
        onRender: () => {
          const qs = queryString.parse(location.search);
          qs["unreadOnly"] = qs["unreadOnly"] === "1" ? "0" : "1";
          const onChange = () => {
            history.push({
              pathname: "/feed",
              search: queryString.stringify(qs),
            });
          };

          return (
            <div>
              <Toggle
                className="p-2 pb-0"
                label="Unread Only"
                inlineLabel
                onChange={onChange}
                checked={qs["unreadOnly"] === "0"}
              />
            </div>
          );
        },
      },
      {
        key: "Views",
        itemType: ContextualMenuItemType.Header,
        onRenderIcon: () => null,
        text: "Views",
      },
      {
        key: "cardView",
        text: "card view",
        iconProps: { iconName: "GridViewMedium" },
        onClick: () => setViewType(ViewType.card),
      },
      {
        key: "listView",
        text: "list view",
        iconProps: { iconName: "GroupedList" },
        onClick: () => setViewType(ViewType.list),
      },
      {
        key: "splitView",
        text: "split view",
        iconProps: { iconName: "ColumnRightTwoThirds" },
        onClick: () => setViewType(ViewType.threeway),
      },
    ],
  };

  const profileMenuProps: IContextualMenuProps = {
    alignTargetEdge: true,
    directionalHint: DirectionalHint.rightTopEdge,
    items: [
      {
        key: "logoff",
        text: "logoff",
        iconProps: { iconName: "SignOut" },
        onClick: () => localStorage.removeItem("inoreaderToken"),
      },
    ],
  };

  return (
    <div
      className={classnames(
        "flex items-center col-start-1 z-50 transition-all",
        "justify-between col-span-4 row-start-3 row-span-1",
        "sm:flex-col sm:justify-start sm:col-span-1 sm:row-start-1 sm:row-span-3",
        {
          "sm:w-48 col-span-2 ms-depth-64": isSidePaneOpen,
          "sm:w-full": !isSidePaneOpen,
        },
        className
      )}
      style={{
        backgroundColor: NeutralColors.gray10,
      }}
    >
      <SideBarItem
        className="hidden sm:block"
        iconProps={isSidePaneOpen ? cancelIcon : globalNavButtonIcon}
        isIconOnly={!isSidePaneOpen}
        text=" "
        onClick={handleHamburgerMenuBtnClick}
      />
      <SideBarItem
        className={pathname === "/feed" ? "hidden sm:block" : ""}
        iconProps={homeIcon}
        isIconOnly={!isSidePaneOpen}
        onClick={handleFeedClick}
        text="Feed"
      />
      <SideBarItem
        className="block sm:hidden"
        iconProps={filterIcon}
        isIconOnly={true}
        onClick={handleFilterClick}
        text="Filter"
      />
      <SideBarItem
        className="hidden sm:block"
        iconProps={viewIcon}
        menuProps={menuProps}
        isIconOnly={!isSidePaneOpen}
        text="View"
      />
      <SideBarItem
        className="block sm:hidden"
        iconProps={viewIcon}
        onClick={() => setIsViewSettingPaneOpen(true)}
        isIconOnly={!isSidePaneOpen}
        text="View"
      />
      <div className="hidden sm:block flex-1 flex-col w-full">
        <Switch>
          <Route
            path={["/feed/:options", "/feed"]}
            render={() => (
              <>
                <SideBarItem
                  iconProps={syncIcon}
                  isIconOnly={!isSidePaneOpen}
                  content=""
                  styles={{
                    icon: isLoaddingFeeds ? "fr-spin" : "",
                  }}
                  onClick={handleSyncClick}
                >
                  sync
                </SideBarItem>
              </>
            )}
          />
        </Switch>
      </div>
      <SideBarItem
        className="hidden sm:block"
        iconProps={contactIcon}
        isIconOnly={!isSidePaneOpen}
        menuProps={profileMenuProps}
        content=""
        onClick={handleProfileClick}
      >
        profile
      </SideBarItem>
    </div>
  );
};

export default SideBar;
