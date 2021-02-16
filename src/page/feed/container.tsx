import React, {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useSearchParam } from "../../utils/useSearchParma";

import { ViewTypeContext, ViewType } from "../../context/viewType";
import { ArticleContext } from "../../context/article";
import { FeedContext } from "../../context/feed";

import FeedPageComponent from "./component";
import { FeedProps } from "../../component/feedsPane/types";

import { initState, reducer } from "./reducer";
import { useFeedsData } from "./utils";

export interface Props {
  className?: string;
  isOverViewPaneOpen: boolean;
  setIsOverViewPaneOpen: React.Dispatch<SetStateAction<boolean>>;
}

const FeedContainer = ({
  className,
  isOverViewPaneOpen,
  setIsOverViewPaneOpen,
  ...rest
}: Props) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const { viewType } = useContext(ViewTypeContext);

  const location = useLocation();
  const feedsData = useFeedsData();

  const openOverviewPane = () => setIsOverViewPaneOpen(true);
  const closeOverviewPane = useCallback(() => setIsOverViewPaneOpen(false), [setIsOverViewPaneOpen]);
  const openArticleModal = () => setIsArticleModalOpen(true);
  const closeArticleModal = () => setIsArticleModalOpen(false);

  const articleIndex = parseInt(
    useSearchParam("articleIndex", location) || "0",
    10
  );

  useEffect(() => {
    closeOverviewPane();
  }, [location.search, closeOverviewPane]);

  const onClickFeed = (e: FeedProps): any => {
    const prevActivedFeedId = state.currenActivedFeedId;
    dispatch({ type: "feed/ById/changeCurrentActivedFeedId", payload: e.key });
    dispatch({ type: "feed/ById/markAsRead", payload: e.key });
    if (viewType === ViewType.list) {
      if (
        prevActivedFeedId &&
        prevActivedFeedId !== e.key &&
        state.feeds.byId[prevActivedFeedId] &&
        state.feeds.byId[prevActivedFeedId].isInnerArticleShow
      ) {
        dispatch({
          type: "feed/ById/hideInnerArticle",
          payload: prevActivedFeedId,
        });
      }

      if (e.isInnerArticleShow) {
        dispatch({ type: "feed/ById/hideInnerArticle", payload: e.key });
      } else {
        dispatch({ type: "feed/ById/showInnerArticle", payload: e.key });
      }
    } else if (viewType !== ViewType.threeway) {
      openArticleModal();
    }
  };

  const article = feedsData[articleIndex];

  return (
    <FeedContext.Provider value={{ state, dispatch }}>
      <ArticleContext.Provider value={feedsData[articleIndex]}>
        <FeedPageComponent
          className={className}
          article={article}
          viewType={viewType}
          isArticleModalOpen={isArticleModalOpen}
          isOverViewPaneOpen={isOverViewPaneOpen}
          onClickFeed={onClickFeed}
          openOverviewPane={openOverviewPane}
          closeOverviewPane={closeOverviewPane}
          openArticleModal={openArticleModal}
          closeArticleModal={closeArticleModal}
        />
      </ArticleContext.Provider>
    </FeedContext.Provider>
  );
};

export default FeedContainer;
