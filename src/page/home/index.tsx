import React, { ReactFragment, useState } from "react";
import { default as FeedPage } from "../feed";
import {
  IconButton,
  IIconProps,
  Text,
} from "office-ui-fabric-react";
import "./style.css";
import { Redirect, useHistory, Route, Switch } from "react-router-dom";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };
const homeIcon: IIconProps = { iconName: "Home" };
const addIcon: IIconProps = { iconName: "Add" };
const searchIcon: IIconProps = { iconName: "Search" };
const syncIcon: IIconProps = {
  iconName: "Sync",
  style: { transform: "rolate" },
};
const settingsIcon: IIconProps = { iconName: "Settings" };

interface SidePaneItemProps {
  icon?: IIconProps;
  text?: string;
  className?: string;
  isGap?: boolean;
  onClick?(e: any): void;
}

const Home = () => {
  const [isSidePaneOpen, setIsSidePaneOpen] = useState<boolean>(false);
  const toggleSidePane = (): void => setIsSidePaneOpen(!isSidePaneOpen);
  const history = useHistory();

  const sidePaneItems: SidePaneItemProps[] = [
    {
      icon: globalNavButtonIcon,
      text: "menu",
      className: "hidden sm:block",
      onClick: toggleSidePane,
    },
    {
      icon: homeIcon,
      text: "all feeds",
      onClick: () => history.replace("/feed"),
    },
    {
      icon: searchIcon,
      text: "search",
      onClick: () => history.replace("/search"),
    },
    {
      icon: addIcon,
      text: "add",
      onClick: () => history.replace("/add"),
    },
    {
      icon: syncIcon,
      text: "sync",
      onClick: () => {},
    },
    {
      isGap: true,
    },
    {
      icon: settingsIcon,
      text: "settings",
      onClick: () => history.replace("/setting"),
    },
  ];

  const sidePeneRender = (): ReactFragment => {
    return sidePaneItems.map((item: SidePaneItemProps) => {
      if (item.isGap) {
        return <div className="flex-1"></div>;
      } else {
        return (
          <div className={`w-full h-10 flex items-center ${item?.className}`}>
            <IconButton
              className="w-full h-full text-gray-300"
              iconProps={item?.icon}
              onClick={item?.onClick}
            >
              <Text
                className={`hidden ${
                  isSidePaneOpen ? "sm:block" : ""
                }   flex-1 text-left ml-2`}
              >
                {item?.text}
              </Text>
            </IconButton>
          </div>
        );
      }
    });
  };

const   sidePaneitemsRender = (items):React.ReactFragment => {
  return sidePaneItems.map((item: SidePaneItemProps) => {
    if (item.isGap) {
      return <div className="flex-1"></div>;
    } else {
      return (
        <div className={`w-full h-10 flex items-center ${item?.className}`}>
          <IconButton
            className="w-full h-full text-gray-300"
            iconProps={item?.icon}
            onClick={item?.onClick}
          >
            <Text
              className={`hidden ${
                isSidePaneOpen ? "sm:block" : ""
              }   flex-1 text-left ml-2`}
            >
              {item?.text}
            </Text>
          </IconButton>
        </div>
      );
    }
  });
}

  const emptyRender = (): React.ReactElement | null => null;

  return (
    <div className="home__layout w-screen h-screen">
      <div
        className={`
          col-start-1 z-50 flex items-center justify-between bg-gray-600 transition-all
          flex-row col-span-4 row-start-3 row-span-1
          sm:flex-col  sm:col-span-1 sm:row-start-1  sm:row-span-3 
          ${isSidePaneOpen ? "sm:w-48 col-span-2" : "sm:w-full"}
        `}
      >
        {sidePeneRender()}
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
