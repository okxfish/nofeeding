import {
  ContextualMenuItemType,
  DirectionalHint,
  IContextualMenuProps,
  IIconProps,
  Stack,
  Toggle,
} from "@fluentui/react";
import { NeutralColors } from "@fluentui/theme";
import React, {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import SideBarItem from "./sideBarButton";
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
  toggleOverviewPane(): void;
  setIsOverViewPaneOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsViewSettingPaneOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsAddFeedModalOpen: React.Dispatch<SetStateAction<boolean>>;
}

const SideBar = ({
  className,
  toggleOverviewPane,
  setIsAddFeedModalOpen,
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
    toggleOverviewPane();
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

  const handleMouseLeave = useCallback(() => {
    setTimeout(() => {
      if (isSidePaneOpen) {
        setIsSidePaneOpen(false);
      }
    }, 300);
  }, [isSidePaneOpen]);

  return (
    <Stack
      className={classnames("z-50 w-12", className)}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: NeutralColors.gray30,
      }}
    >
      <SideBarItem
        title="meun"
        className="hidden sm:block"
        iconProps={isSidePaneOpen ? cancelIcon : globalNavButtonIcon}
        onClick={handleHamburgerMenuBtnClick}
      />
      <SideBarItem
        title="home"
        className={pathname === "/feed" ? "hidden sm:block" : ""}
        iconProps={homeIcon}
        onClick={handleFeedClick}
      />
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
      />
      <SideBarItem
        title="view setting"
        className="block sm:hidden"
        iconProps={viewIcon}
        onClick={() => setIsViewSettingPaneOpen(true)}
      />
      <div className="hidden sm:block flex-1 flex-col w-full">
        <Switch>
          <Route
            path={["/feed/:options", "/feed"]}
            render={() => (
              <>
                <SideBarItem
                  iconProps={syncIcon}
                  title="sync feed"
                  styles={{
                    icon: isLoaddingFeeds ? "fr-spin" : "",
                  }}
                  onClick={handleSyncClick}
                />
                <SideBarItem
                  title="subscript new feed "
                  iconProps={{ iconName: "Add" }}
                  onClick={() => setIsAddFeedModalOpen(true)}
                />
              </>
            )}
          />
        </Switch>
      </div>
      <SideBarItem
        className="hidden sm:block"
        title="account"
        iconProps={contactIcon}
        menuProps={profileMenuProps}
        onClick={handleProfileClick}
      />
    </Stack>
  );
};

export default SideBar;
