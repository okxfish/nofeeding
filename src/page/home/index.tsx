import React, { useState, useEffect, useRef } from "react";
import { default as FeedPage } from "../feed";
import { IContextualMenuProps, IIconProps } from "office-ui-fabric-react";
import Parser from "rss-parser";
import { Parser as HtmlToReactParser } from "html-to-react";
import { Redirect, useHistory, Route, Switch } from "react-router-dom";
import SideBarItem from "./sideBarItem";
import "./style.css";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };
const homeIcon: IIconProps = { iconName: "Home" };
const addIcon: IIconProps = { iconName: "Add" };
const searchIcon: IIconProps = { iconName: "Search" };
const syncIcon: IIconProps = { iconName: "Sync" };
const settingsIcon: IIconProps = { iconName: "Settings" };
const viewIcon: IIconProps = { iconName: "View" };

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

const parser: Parser<any, any> = new Parser({
  // customFields: { feed: null, item: null },
});

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
  const htmlToReactParserRef = useRef({ parse: (a) => <div></div> });
  const [isSidePaneOpen, setIsSidePaneOpen] = useState<boolean>(false);
  const [isLoaddingFeeds, setIsLoaddingFeeds] = useState<boolean>(false);
  const [feedsData, setFeedsData] = useState([{ content: '', title: '' }]);
  const toggleSidePane = (): void => setIsSidePaneOpen(!isSidePaneOpen);
  const history = useHistory();

  useEffect(() => {
    htmlToReactParserRef.current = new HtmlToReactParser();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const feed = await parser.parseURL(
          CORS_PROXY + "http://feeds.feedburner.com/ruanyifeng"
        );
        console.log(feed.title); // feed will have a `foo` property, type as a string
        feed.items.forEach((item) => {
          console.log(item.title + ":" + item.link); // item will have a `bar` property type as a number
        });
        setFeedsData(feed.items);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    let timeout;
    if (isLoaddingFeeds) {
      timeout = setTimeout(() => setIsLoaddingFeeds(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isLoaddingFeeds]);

  const emptyRender = (): React.ReactElement | null => null;

  const handleFeedClick = () => {
    history.replace("/feed");
  };

  const handleSearchClick = () => {
    history.replace("/search");
  };

  const handleAddClick = () => {
    history.replace("/add");
  };

  const handleSyncClick = () => {
    setIsLoaddingFeeds(true);
  };

  const handleHamburgerMenuBtnClick = () => {
    toggleSidePane();
  };

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
          onClick={handleHamburgerMenuBtnClick}
        >
          menu
        </SideBarItem>
        <SideBarItem
          iconProps={homeIcon}
          isIconOnly={!isSidePaneOpen}
          onClick={handleFeedClick}
        >
          feed
        </SideBarItem>
        <SideBarItem
          iconProps={searchIcon}
          isIconOnly={!isSidePaneOpen}
          onClick={handleSearchClick}
        >
          search
        </SideBarItem>
        <SideBarItem
          iconProps={addIcon}
          isIconOnly={!isSidePaneOpen}
          onClick={handleAddClick}
        >
          add
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
        <Route
          path="/article"
          render={() => {
            if (
              !htmlToReactParserRef ||
              !htmlToReactParserRef.current ||
              typeof htmlToReactParserRef.current.parse === "undefined"
            ) {
              return null;
            } else {
              return (
                <div className="w-176 mx-auto scrollbar h-full overflow-y-auto p-10 col-start-2 col-span-3 row-start-1 row-span-3">
                  <h1>{feedsData[0].title}</h1>
                  {htmlToReactParserRef.current.parse(feedsData[0].content)}
                </div>
              );
            }
          }}
        />
        <Redirect path="/" to="/feed" exact />
      </Switch>
    </div>
  );
};

export default Home;
