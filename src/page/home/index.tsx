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
      <div className="w-2/12">
        <OverviewPane />
      </div>
      <div className="scrollbar w-10/12 h-full overflow-x-auto">
        <FeedsPane
          className=" w-2/4 bg-gray-100 mx-auto"
          onClickFeed={openModal}
        />
      </div>
      <Modal
        isOpen={isArticleModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
      >
        <ArticlePane className="px-6" style={{maxHeight: '95vh'}}/>
      </Modal>
    </div>
  );
};

export default Home;
