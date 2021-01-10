import React, { useState } from "react";
import { default as OverviewPane } from "../../component/overviewPane";
import { default as FeedsPane } from "../../component/feedsPane";
import { default as ArticlePane } from "../../component/articlePane";
import { Modal, IconButton, IIconProps } from "office-ui-fabric-react";
import { useWindowSize } from "react-use";
import "./style.css";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };

const FeedPage = () => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const hideModal = (): void => setIsArticleModalOpen(false);
  const openModal = (): void => setIsArticleModalOpen(true);
  const { width: windowSize } = useWindowSize();

  const onClickFeed = (): void => {
    if (windowSize < 1280) {
      openModal();
    }
  };

  return (
    <>
      <div className="row-start-1 row-span-1 col-start-1 col-span-4 bg-gray-600 sm:hidden">
        <IconButton
          className="text-gray-300"
          iconProps={globalNavButtonIcon}
          onClick={() => setIsOverViewPaneOpen(!isOverViewPaneOpen)}
        />
      </div>
      <div
        className={`
        ${isOverViewPaneOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col transform transition-all h-full
        row-start-1 row-span-3 w-64 bg-gray-200
        col-start-1 z-50 shadow-lg
        sm:col-span-1 sm:col-start-2 sm:translate-x-0 sm:z-10 sm:shadow-none
      `}
      >
        <IconButton
          className="sm:hidden"
          iconProps={globalNavButtonIcon}
          onClick={() => setIsOverViewPaneOpen(!isOverViewPaneOpen)}
        />
        <OverviewPane className="" />
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
    </>
  );
};

export default FeedPage;
