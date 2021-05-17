import { DirectionalHint, IContextualMenuProps, IIconProps } from "@fluentui/react";
import React, { SetStateAction, useContext, useEffect, useState } from "react";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import SideBarItem from "./sideBarItem";
import classnames from "classnames";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };
const filterIcon: IIconProps = { iconName: "Filter" };
const homeIcon: IIconProps = { iconName: "Home" };
const syncIcon: IIconProps = { iconName: "Sync" };
const contactIcon: IIconProps = { iconName: "Contact" };
const viewIcon: IIconProps = { iconName: "View" };

export interface Props {
  className?: string;
  setIsOverViewPaneOpen: React.Dispatch<SetStateAction<boolean>>;
}

const SideBar = ({ className, setIsOverViewPaneOpen }: Props) => {
  const [isSidePaneOpen, setIsSidePaneOpen] = useState<boolean>(false);
  const [isLoaddingFeeds, setIsLoaddingFeeds] = useState<boolean>(false);
  const { pageName } = useParams<{ pageName: string }>();

  useEffect(() => {
    let timeout;
    if (isLoaddingFeeds) {
      timeout = setTimeout(() => setIsLoaddingFeeds(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isLoaddingFeeds]);

  const { setViewType } = useContext(ViewTypeContext);

  const history = useHistory();

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

  const handleProfileClick = async () => {

  };

  const handleHamburgerMenuBtnClick = () => {
    toggleSidePane();
  };

  const menuProps: IContextualMenuProps = {
    alignTargetEdge: true,
    directionalHint: DirectionalHint.rightTopEdge,
    items: [
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

  return (
    <div
      className={classnames(
        "flex items-center col-start-1 z-50  bg-gray-700 transition-all",
        "justify-between col-span-4 row-start-3 row-span-1",
        "sm:flex-col sm:justify-start sm:col-span-1 sm:row-start-1 sm:row-span-3",
        {
          "sm:w-48 col-span-2": isSidePaneOpen,
          "sm:w-full": !isSidePaneOpen,
        },
        className
      )}
    >
      <SideBarItem
        className="hidden sm:block"
        iconProps={globalNavButtonIcon}
        isIconOnly={!isSidePaneOpen}
        content=""
        onClick={handleHamburgerMenuBtnClick}
      >
        {''}
      </SideBarItem>
      <SideBarItem
        className={pageName === "feed" ? "hidden sm:block" : ""}
        iconProps={homeIcon}
        isIconOnly={!isSidePaneOpen}
        onClick={handleFeedClick}
      >
        feed
      </SideBarItem>
      <SideBarItem
        className={pageName === "feed" ? "block sm:hidden" : "hidden"}
        iconProps={filterIcon}
        isIconOnly={true}
        onClick={handleFilterClick}
      >
        filter
      </SideBarItem>
      <div className="hidden sm:block flex-1 flex-col w-full my-8">
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
                <SideBarItem
                  iconProps={viewIcon}
                  menuProps={menuProps}
                  isIconOnly={!isSidePaneOpen}
                >
                  view
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
        content=""
        onClick={handleProfileClick}
      >
        profile
      </SideBarItem>
    </div>
  );
};

export default SideBar;
