import React, { useEffect, useState, Suspense, lazy, useContext } from "react";
import classnames from "classnames";
import Parser from "rss-parser";

import { useWindowSize } from "react-use";
import { useSearchParam } from "../../utils/useSearchParma";
import { useLocation } from "react-router-dom";

import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import { Modal, IconButton, IIconProps } from "office-ui-fabric-react";
import { ViewType, ViewTypeContext } from "../../App";
import ArticlePane from "../../component/articlePane";

import "./style.css";

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

const globalNavButtonIcon: IIconProps = { iconName: "GlobalNavButton" };

const parser: Parser<any, any> = new Parser();

const OverviewPane = lazy(() => import("../../component/overviewPane"));
const FeedsPane = lazy(() => import("../../component/feedsPane"));
const AnimationPane = lazy(() => import("../../component/animationPane"));

const FeedPage = () => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const [feedsData, setFeedsData] = useState([{ content: "", title: "" }]);
  const { viewType, setViewType } = useContext(ViewTypeContext);
  const hideModal = (): void => setIsArticleModalOpen(false);
  const openModal = (): void => setIsArticleModalOpen(true);
  const { width: windowSize } = useWindowSize();
  const location = useLocation();

  const openOverviewPane = () => setIsOverViewPaneOpen(true);
  const closeOverviewPane = () => setIsOverViewPaneOpen(false);

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

  useEffect(()=>{
    closeOverviewPane();
  },[location.search]);

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
          <div className="h-full w-full flex items-center justify-center col-start-1 col-span-4">
            <Spinner
              className="m-auto mt-72"
              size={SpinnerSize.large}
              label="loading..."
            />
          </div>
        }
      >
        <div
          className="
            flex items-center justify-between z-30
            row-start-1 row-span-1 col-start-1 col-span-4
            border-b border-gray-200
            sm:hidden
          "
        >
          <IconButton
            className="text-gray-600 sm:text-gray-300"
            iconProps={globalNavButtonIcon}
            onClick={openOverviewPane}
          />
        </div>
        <AnimationPane
          rootClassName="
              row-start-1 row-span-3
              col-start-1 col-span-4
              sm:col-span-1 sm:col-start-2
            "
          isOpend={isOverViewPaneOpen}
          onClose={closeOverviewPane}
          canMaskClose
        >
          <OverviewPane className="bg-white border-r rounded-t-2xl pt-6 px-2 sm:rounded-none sm:pt-0" />
        </AnimationPane>
        <div
          className={classnames(
            "overflow-auto scrollbar h-full",
            "col-start-1 col-span-4 row-start-2 row-span-2",
            "sm:col-start-3 sm:col-span-2 sm:row-start-1 sm:row-span-3",
            "xl:col-start-3 xl:col-span-1"
            // { "": viewType !== ViewType.threeway }
          )}
          data-is-scrollable
        >
          <FeedsPane
            className="h-full transition-all"
            onClickFeed={onClickFeed}
          />
        </div>
        {viewType === ViewType.threeway ? (
          <div
            className="
              h-full scrollbar overflow-y-auto 
              hidden col-start-4 col-span-1 row-start-1 row-span-3
              xl:block xl:col-start-4 xl:col-span-1
            "
          >
            <ArticlePane className="px-6" article={feedsData[articleIndex]} />
          </div>
        ) : null}
        <Modal
          className=""
          isOpen={isArticleModalOpen}
          onDismiss={hideModal}
          overlay={{ style: { backdropFilter: "blur(42px)" } }}
          isBlocking={false}
          styles={{ main: { maxHeight: "100%", maxWidth: "100%" } }}
        >
          <ArticlePane
            className="article-modal px-6 h-screen w-screen"
            closeModal={() => setIsArticleModalOpen(false)}
            article={feedsData[articleIndex]}
          />
        </Modal>
      </Suspense>
    </>
  );
};

export default FeedPage;
