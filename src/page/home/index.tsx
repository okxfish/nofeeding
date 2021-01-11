import React, { useState, useEffect } from "react";
import { default as FeedPage } from "../feed";
import { IContextualMenuProps, IIconProps } from "office-ui-fabric-react";
import "./style.css";
import { Redirect, useHistory, Route, Switch } from "react-router-dom";
import SideBarItem from "./sideBarItem";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };
const homeIcon: IIconProps = { iconName: "Home" };
const addIcon: IIconProps = { iconName: "Add" };
const searchIcon: IIconProps = { iconName: "Search" };
const syncIcon: IIconProps = {
  iconName: "Sync",
  style: { transform: "rolate" },
};
const settingsIcon: IIconProps = { iconName: "Settings" };
const viewIcon: IIconProps = { iconName: "View" };

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: "cardView",
      text: "card view",
      iconProps: { iconName: "GridViewMedium" },
    },
    {
      key: "listView",
      text: "list view",
      iconProps: { iconName: "GroupedList" },
    },
    {
      key: "splitView",
      text: "split view",
      iconProps: { iconName: "ColumnRightTwoThirds" },
    },
    {
      key: "articleView",
      text: "article view",
      iconProps: { iconName: "ReadingMode" },
    },
  ],
};

const Home = () => {
  const [isSidePaneOpen, setIsSidePaneOpen] = useState<boolean>(false);
  const [isLoaddingFeeds, setIsLoaddingFeeds] = useState<boolean>(false);
  const toggleSidePane = (): void => setIsSidePaneOpen(!isSidePaneOpen);
  const history = useHistory();

  useEffect(() => {
    let timeout;
    if (isLoaddingFeeds) {
      timeout = setTimeout(() => setIsLoaddingFeeds(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isLoaddingFeeds]);

  const emptyRender = (): React.ReactElement | null => null;

  return (
    <div className="home__layout w-screen h-screen">
      <div
        className={`
          col-start-1 z-50 flex items-center justify-between bg-gray-600 transition-all
          flex-row col-span-4 row-start-3 row-span-1
          sm:flex-col sm:justify-start sm:col-span-1 sm:row-start-1  sm:row-span-3 
          ${isSidePaneOpen ? "sm:w-48 col-span-2" : "sm:w-full"}
        `}
      >
        <SideBarItem
          className="hidden sm:block"
          iconProps={globalNavButtonIcon}
          isIconOnly={!isSidePaneOpen}
          content=""
          onClick={toggleSidePane}
        >
          menu
        </SideBarItem>
        <SideBarItem
          iconProps={homeIcon}
          isIconOnly={!isSidePaneOpen}
          onClick={() => history.replace("/feed")}
        >
          feed
        </SideBarItem>
        <SideBarItem
          iconProps={searchIcon}
          isIconOnly={!isSidePaneOpen}
          onClick={() => history.replace("/search")}
        >
          search
        </SideBarItem>
        <SideBarItem
          iconProps={addIcon}
          isIconOnly={!isSidePaneOpen}
          onClick={() => history.replace("/add")}
        >
          add
        </SideBarItem>
        <Switch>
          <Route
            path={["/feed/:options", "/feed"]}
            render={() => (
              <>
                <SideBarItem
                  className=" border-t border-gray-200"
                  iconProps={syncIcon}
                  isIconOnly={!isSidePaneOpen}
                  content=""
                  styles={{
                    icon: isLoaddingFeeds ? "fr-spin" : "",
                  }}
                  onClick={() => setIsLoaddingFeeds(true)}
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
        <div className="hide sm:block flex-1"></div>
        <SideBarItem
          className=" border-t border-gray-200"
          iconProps={settingsIcon}
          isIconOnly={!isSidePaneOpen}
          content=""
          onClick={() => history.replace("/setting")}
        >
          settings
        </SideBarItem>
      </div>
      <Switch>
        <Route path={["/feed/:options", "/feed"]} component={FeedPage} />
        <Route path="/add" render={emptyRender} />
        <Route path="/search" render={emptyRender} />
        <Route path="/setting" render={emptyRender} />
        <Redirect path="/" to="/feed" exact />
      </Switch>
    </div>
  );
};

export default Home;
