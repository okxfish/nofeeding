import React, { useEffect, useState, Suspense, lazy } from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import { Modal, IconButton, IIconProps } from "office-ui-fabric-react";
import { useWindowSize } from "react-use";
import { useSearchParam } from "../../utils/useSearchParma";
import "./style.css";
import Parser from "rss-parser";
import { useLocation } from "react-router-dom";

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };

const parser: Parser<any, any> = new Parser();

const OverviewPane = lazy(() => import("../../component/overviewPane"));
const FeedsPane = lazy(() => import("../../component/feedsPane"));
const ArticlePane = lazy(() => import("../../component/articlePane"));

const FeedPage = () => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const [feedsData, setFeedsData] = useState([{ content: "", title: "" }]);
  const hideModal = (): void => setIsArticleModalOpen(false);
  const openModal = (): void => setIsArticleModalOpen(true);
  const { width: windowSize } = useWindowSize();
  const location = useLocation();

  const articleIndex = parseInt(
    useSearchParam("articleIndex", location) || "0",
    10
  );

  useEffect(() => {
    (async () => {
      try {
        const feed = await parser.parseURL(
          CORS_PROXY + "http://feeds.feedburner.com/ruanyifeng"
        );
        setFeedsData(feed.items);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const onClickFeed = (e: any): any => {
    e.preventDefault();
    if (windowSize < 1280) {
      openModal();
    }
  };

  return (
    <>
      <Suspense
        fallback={
          <Spinner
            className="m-auto mt-72"
            size={SpinnerSize.large}
            label="loading..."
          />
        }
      >
        <div
          className="
        flex items-center justify-between row-start-1 row-span-1 bg-gray-100 border-b border-gray-200 col-start-1 col-span-4 z-30
        sm:hidden
      "
        >
          <IconButton
            className="text-gray-600 sm:text-gray-300"
            iconProps={globalNavButtonIcon}
            onClick={() => setIsOverViewPaneOpen(!isOverViewPaneOpen)}
          />
        </div>
        <div
          className={`
        ${isOverViewPaneOpen ? "translate-y-0" : "translate-y-full"}
        flex flex-col transform transition-all h-2/3 self-end
        row-start-1 row-span-3 bg-gray-200
        col-start-1 col-span-4 z-50 shadow-lg
        sm:col-span-1 sm:col-start-2 sm:z-10 sm:shadow-none sm:h-full sm:translate-x-0 sm:translate-y-0
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
        col-start-1 col-span-4 row-start-2 row-span-2 
        sm:col-start-3 sm:col-span-2 sm:row-start-1 sm:row-span-3 
        xl:col-start-3 xl:col-span-1"
        >
          <FeedsPane
            className="h-full transition-all"
            onClickFeed={onClickFeed}
          />
        </div>
        <div
          className="
          h-full scrollbar overflow-y-auto 
          hidden col-start-4 col-span-1 row-start-1 row-span-3
          xl:block xl:col-start-4 xl:col-span-1
      "
        >
          <ArticlePane className="px-6" article={feedsData[articleIndex]} />
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
      </Suspense>
    </>
  );
};

export default FeedPage;
