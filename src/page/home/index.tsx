import React from "react";
import { default as OverviewPane } from "../../component/overviewPane";
import { default as FeedsPane } from "../../component/feedsPane";
import { default as ArticlePane } from "../../component/articlePane";

const Home = () => {
  return (
    <div className="flex h-screen">
      <div className="w-2/12">
        <OverviewPane />
      </div>
      <div className="scrollbar w-3/12 bg-gray-100 h-full overflow-x-auto">
        <FeedsPane />
      </div>
      <div className="w-7/12 bg-white">
        <ArticlePane />
      </div>
    </div>
  );
};

export default Home;
