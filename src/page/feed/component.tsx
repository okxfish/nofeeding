import React from "react";
import classnames from "classnames";
import OverviewPane from "../../component/overviewPane";
import FeedsPane from "../../component/feedsPane";
import ArticlePane from "../../component/articlePane";
import { Modal } from "office-ui-fabric-react";
import { ViewType } from "../../context/viewType";

import { FeedProps } from "../../component/feedsPane/types";
import { CSSTransition } from "react-transition-group";
import "./style.css";

export interface Props {
  className?: string;
  article: any;
  viewType: ViewType;
  isArticleModalOpen: boolean;
  isOverViewPaneOpen: boolean;
  isFetching: boolean;
  onClickFeed(e: FeedProps): any;
  openOverviewPane(): any;
  closeOverviewPane(): any;
  closeArticleModal(): any;
  openArticleModal(): any;
}

const FeedPageComponent = ({
  className,
  article,
  viewType,
  isArticleModalOpen,
  isOverViewPaneOpen,
  onClickFeed,
  isFetching,
  openOverviewPane,
  closeOverviewPane,
  closeArticleModal,
  openArticleModal,
}: Props) => {
  return (
    <>
      <div
        className="
            flex items-center justify-between z-30
            row-start-1 row-span-1 col-start-1 col-span-4
            border-b border-gray-200
            sm:hidden
          "
      ></div>
      <CSSTransition
        classNames="block sm:hidden overview-pane-animate-wrapper overview-pane-animate-wrapper"
        in={isOverViewPaneOpen}
        timeout={{ exit: 400, enter: 0 }}
        unmountOnExit
      >
        <div className="z-50">
          <div
            className="overview-pane__mask h-full fixed top-0 left-0 w-screen h-screen"
            onClick={closeOverviewPane}
          />
          <OverviewPane className="bg-white rounded-t-2xl shadow-lg pt-6 px-2 sm:rounded-none sm:pt-0 overview-pane overview-pane-modal" />
        </div>
      </CSSTransition>
      <div className="hidden sm:block row-start-1 row-span-3 col-start-1 col-span-4 sm:col-span-1 sm:col-start-2 border-r">
        <OverviewPane className="bg-white rounded-t-2xl pt-6 px-2 sm:rounded-none sm:pt-0 h-full" />
      </div>
      <div
        className={classnames(
          "overflow-auto scrollbar h-full",
          "col-start-1 col-span-4 row-start-2 row-span-1",
          "sm:col-start-3 sm:col-span-2 sm:row-start-1 sm:row-span-3",
          { "xl:col-span-1": viewType === ViewType.threeway }
        )}
        data-is-scrollable
      >
        <FeedsPane
          className="h-full transition-all"
          isFetching={isFetching}
          onClickFeed={onClickFeed}
        />
      </div>
      {viewType === ViewType.threeway ? (
        <div
          className="
              hidden col-start-4 col-span-1 row-start-1 row-span-3
              xl:block xl:col-start-4 xl:col-span-1
            "
        >
          <ArticlePane className="h-full" article={article} />
        </div>
      ) : null}
      <Modal
        className=""
        isOpen={isArticleModalOpen}
        onDismiss={closeArticleModal}
        overlay={{ style: { backgroundColor: "rgba(0, 0, 0, 0.75)" } }}
        isBlocking={false}
        styles={{ main: { maxHeight: "100%", maxWidth: "100%" } }}
      >
        <ArticlePane
          className="article-modal h-screen w-screen"
          closeModal={closeArticleModal}
          article={article}
        />
      </Modal>
    </>
  );
};

export default FeedPageComponent;
