import React, { ReactFragment, useState } from "react";
import { default as OverviewPane } from "../../component/overviewPane";
import { default as FeedsPane } from "../../component/feedsPane";
import { default as ArticlePane } from "../../component/articlePane";
import { Modal, IconButton, IIconProps, Text } from "office-ui-fabric-react";
import feedsMockData from "../../mock/feed";

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
  const [isSidePaneOpen, setIsSidePaneOpen] = useState<boolean>(true);
  const hideModal = (): void => setIsArticleModalOpen(false);
  const openModal = (): void => setIsArticleModalOpen(true);
  const toggleSidePane = (): void => setIsSidePaneOpen(!isSidePaneOpen);

  const sidePaneItems: SidePaneItemProps[] = [
    {
      icon: globalNavButtonIcon,
      text: "menu",
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
              {isSidePaneOpen && (
                <Text className="flex-1 text-left ml-2">{item?.text}</Text>
              )}
            </IconButton>
          </div>
        );
      }
    });
  };

  return (
    <div className="flex h-screen">
      <div
        className={`w-${
          isSidePaneOpen ? "48" : "16"
        } flex flex-col items-center bg-gray-300 transition-all`}
      >
        {sidePeneRender()}
      </div>
      <div className="w-80 bg-gray-200">
        <OverviewPane />
      </div>
      <div className="bg-white">
        <FeedsPane
          className="scrollbar h-full overflow-y-auto bg-gray-50 lg:w-auto xl:w-112 2xl:w-128 transition-all"
          onClickFeed={openModal}
        />
      </div>
      <div className="lg:hidden xl:block flex-1 h-full scrollbar overflow-y-auto">
        <ArticlePane className="px-6" />
      </div>
      <Modal
        isOpen={isArticleModalOpen}
        onDismiss={hideModal}
        overlay={{ style: { backdropFilter: "blur(16px)" } }}
        isBlocking={false}
      >
        <ArticlePane className="px-6" style={{ maxHeight: "95vh" }} />
      </Modal>
    </div>
  );
};

export default Home;
