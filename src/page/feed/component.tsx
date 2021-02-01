import React from "react";
import classnames from "classnames";
import OverviewPane from "../../component/overviewPane";
import FeedsPane from "../../component/feedsPane";
import AnimationPane from "../../component/animationPane";
import ArticlePane from "../../component/articlePane";
import { Modal, IconButton, IIconProps } from "office-ui-fabric-react";
import { ViewType } from "../../context/viewType";

import "./style.css";
import { FeedProps } from "../../component/feedsPane/types";

export interface Props {
  className?: string;
  article: any;
  viewType: ViewType;
  isArticleModalOpen: boolean;
  isOverViewPaneOpen: boolean;
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
      >
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
          { "xl:col-span-1": viewType === ViewType.threeway }
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
          <ArticlePane className="px-6" article={article} />
        </div>
      ) : null}
      <Modal
        className=""
        isOpen={isArticleModalOpen}
        onDismiss={closeArticleModal}
        overlay={{ style: { backdropFilter: "blur(42px)" } }}
        isBlocking={false}
        styles={{ main: { maxHeight: "100%", maxWidth: "100%" } }}
      >
        <ArticlePane
          className="article-modal px-6 h-screen w-screen"
          closeModal={closeArticleModal}
          article={article}
        />
      </Modal>
    </>
  );
};

export default FeedPageComponent;
