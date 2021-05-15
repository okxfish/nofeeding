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
import { useQuery, useQueryClient } from "react-query";
import { default as api } from "../../api";

import { ViewTypeContext, ViewType } from "../../context/viewType";
import { ArticleContext } from "../../context/article";
import { FeedContext } from "../../context/feed";

import FeedPageComponent from "./component";
import { FeedProps } from "../../component/feedsPane/types";

import { normalize, schema } from "normalizr";

import { initState, reducer } from "./reducer";

export interface Props {
  className?: string;
  isOverViewPaneOpen: boolean;
  setIsOverViewPaneOpen: React.Dispatch<SetStateAction<boolean>>;
}
const article = new schema.Entity("article");

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

  const queryClient = useQueryClient();

  const openOverviewPane = () => setIsOverViewPaneOpen(true);

  const closeOverviewPane = useCallback(
    () => setIsOverViewPaneOpen(false),
    [setIsOverViewPaneOpen]
  );
  const openArticleModal = () => setIsArticleModalOpen(true);
  const closeArticleModal = () => setIsArticleModalOpen(false);

  useEffect(() => {
    closeOverviewPane();
  }, [location.search, closeOverviewPane]);

  const streamContentQuery = useQuery(
    "feed/streamContentQuery",
    async () => {
      const { data } = await api.inoreader.getStreamContents();
      const transformedData = data.items.map((item) => ({
        id: item.id,
        title: item.title,
        summary: "",
        content: item.summary.content,
        sourceName: item.origin.title,
        sourceID: item.origin.title.streamId,
        time: item.timestampUsec,
        isRead: false,
        isStar: false,
        isPin: false,
        isInnerArticleShow: false,
      }));
      const normalizeData = normalize<any>(transformedData, [article]);
      return normalizeData;
    },
    {
      select: ({ result, entities }) => {
         let list = []
         const article = entities.article;
        if (typeof article === "object" && article !== null) {
          list = result.map((item) => article[item]);
        }
        return {
          list,
          result,
          entities,
        };
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  console.log(streamContentQuery.data?.list);

  const onClickFeed = (e: FeedProps): any => {
    const prevActivedFeedId = state.currenActivedFeedId;
    dispatch({ type: "feed/ById/changeCurrentActivedFeedId", payload: e.key });
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

  return (
    <FeedContext.Provider
      value={{ state, dispatch, streamContents: streamContentQuery.data?.list }}
    >
      <ArticleContext.Provider value={null}>
        <FeedPageComponent
          className={className}
          article={null}
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
