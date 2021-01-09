import React, { ReactFragment, useState } from "react";
import { default as OverviewPane } from "../../component/overviewPane";
import { default as FeedsPane } from "../../component/feedsPane";
import { default as ArticlePane } from "../../component/articlePane";
import { Modal, IconButton, IIconProps, Text } from "office-ui-fabric-react";
import { useWindowSize } from "react-use";
import feedsMockData from "../../mock/feed";
import "./style.css";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };
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
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const [isSidePaneOpen, setIsSidePaneOpen] = useState<boolean>(false);
  const hideModal = (): void => setIsArticleModalOpen(false);
  const openModal = (): void => setIsArticleModalOpen(true);
  const toggleSidePane = (): void => setIsSidePaneOpen(!isSidePaneOpen);
  const {width: windowSize} = useWindowSize();

  const sidePaneItems: SidePaneItemProps[] = [
    {
      icon: globalNavButtonIcon,
      text: "menu",
      className: "hidden sm:block",
      onClick: toggleSidePane,
    },
    {
      icon: searchIcon,
      text: "search",
      onClick: () => console.log("search"),
    },
    {
      icon: addIcon,
      text: "add",
      onClick: () => console.log("add"),
    },
    {
      isGap: true,
    },
    {
      icon: syncIcon,
      text: "sync",
      onClick: () => console.log("sync"),
    },
    {
      icon: settingsIcon,
      text: "settings",
      onClick: () => console.log("settings"),
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
              className="w-full h-full"
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

  const onClickFeed = ():void => {
    if (windowSize < 1280) {
      openModal();
    }
  }

  return (
    <div className="home__layout w-screen h-screen">
      <div className="row-start-1 row-span-1 col-start-1 col-span-4 bg-gray-300 bg-opacity-70 sm:hidden">
        <IconButton
          className=""
          iconProps={globalNavButtonIcon}
          onClick={() => setIsOverViewPaneOpen(!isOverViewPaneOpen)}
        />
      </div>
      <div
        className={`
          col-start-1 z-50 flex items-center justify-between bg-gray-300 bg-opacity-70 transition-all
          flex-row col-span-4 row-start-3 row-span-1
          sm:flex-col  sm:col-span-1 sm:row-start-1  sm:row-span-3 
          ${isSidePaneOpen ? "sm:w-48 col-span-2" : "sm:w-full"}
        `}
        style={{ backdropFilter: "blur(16px)" }}
      >
        {sidePeneRender()}
      </div>
      <div
        className={`
          ${isOverViewPaneOpen ? "translate-x-0" : "-translate-x-full"}
          transform transition-all
          row-start-1 row-span-3 w-64 bg-gray-200
          col-start-1 z-50 shadow-lg
          sm:block sm:col-span-1 sm:col-start-2 sm:translate-x-0 sm:z-10 sm:shadow-none
        `}
      >
        <IconButton
          className="sm:hidden"
          iconProps={globalNavButtonIcon}
          onClick={() => setIsOverViewPaneOpen(!isOverViewPaneOpen)}
        />
        <OverviewPane />
      </div>
      <div
        className="
          overflow-y-auto scrollbar bg-gray-50 h-full
          col-start-1 col-span-4 row-start-2 row-span-1 
          sm:row-span-3 sm:col-start-3 sm:col-span-2 
          xl:col-span-1 xl:max-w-md"
      >
        <FeedsPane
          className="h-full transition-all"
          onClickFeed={onClickFeed}
        />
      </div>
      <div className="hidden xl:block grid-flow-row h-full scrollbar overflow-y-auto col-start-4 col-span-1 row-span-3">
        <ArticlePane className="px-6" />
      </div>
      <Modal
        isOpen={isArticleModalOpen}
        onDismiss={hideModal}
        overlay={{ style: { backdropFilter: "blur(42px)" } }}
        isBlocking={false}
        styles={{ main: { maxHeight: "100%", maxWidth: "100%" } }}
      >
        <ArticlePane
          className="px-6 max-h-screen md:max-h-modal"
          closeModal={() => setIsArticleModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Home;
