import React, { useState } from "react";
import { default as OverviewPane } from "../../component/overviewPane";
import { default as FeedsPane } from "../../component/feedsPane";
import { default as ArticlePane } from "../../component/articlePane";
import { Modal } from "office-ui-fabric-react";
import feedsMockData from "../../mock/feed";

const Home = () => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const hideModal = (): void => setIsArticleModalOpen(false);
  const openModal = (): void => setIsArticleModalOpen(true);

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-16 bg-gray-300">
        
      </div>
      <div className="w-80 bg-gray-100">
        <OverviewPane />
      </div>
      <div className="flex-1 bg-white">
        <FeedsPane
          className="scrollbar h-full overflow-x-auto bg-gray-100 mx-auto lg:w-160"
          onClickFeed={openModal}
        />
      </div>
      <Modal
        isOpen={isArticleModalOpen}
        onDismiss={hideModal}
        overlay={{style: {backdropFilter: "blur(16px)"}}}
        isBlocking={false}
      >
        <ArticlePane className="px-6" style={{maxHeight: '95vh'}}/>
      </Modal>
    </div>
  );
};

export default Home;
