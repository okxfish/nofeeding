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

import { normalize, NormalizedSchema, schema } from "normalizr";

import { initState, reducer } from "./reducer";

import { default as get } from "lodash.get";
import { SystemStreamIDs } from "../../api/inoreader";

export interface Props {
  className?: string;
  isOverViewPaneOpen: boolean;
  setIsOverViewPaneOpen: React.Dispatch<SetStateAction<boolean>>;
}

const article = new schema.Entity<FeedProps>("article");

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

  console.log("viewType", viewType);

  const streamContentQuery = useQuery(
    "feed/streamContentQuery",
    async () => {
      const { data } = await api.inoreader.getStreamContents("", {
        exclude: SystemStreamIDs.READ,
      });
      const res = await api.inoreader.getStreamPreferenceList();
      console.log("getStreamPreferenceList: ", res);
      const transformedData = data.items.map((item) => ({
        key: item.id,
        id: item.id,
        title: item.title,
        summary: "",
        content: item.summary.content,
        sourceName: item.origin.title,
        sourceID: item.origin.title.streamId,
        url: item.canonical[0].href,
        time: item.timestampUsec,
        isRead: false,
        isStar: false,
        isPin: false,
        isInnerArticleShow: false,
      }));
      const normalizeData = normalize<
        FeedProps,
        { article: { [key: string]: FeedProps } },
        string[]
      >(transformedData, [article]);
      return normalizeData;
    },
    {
      select: ({ result, entities }) => {
        let list: FeedProps[] = [];
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
      refetchOnWindowFocus: false,
    }
  );

  const getArticleById = useCallback(
    (id) => get(streamContentQuery.data, `entities.article['${id}']`),
    [streamContentQuery.data]
  );

  const openArticleInner = useCallback(
    (articleId) => {
      const prevArticleId = state.currenActivedFeedId;
      if (prevArticleId !== articleId) {
        const prevArticle = getArticleById(prevArticleId);
        const curArticle = getArticleById(articleId);
        queryClient.setQueryData<
          | NormalizedSchema<
              { article: { [key: string]: FeedProps } },
              string[]
            >
          | undefined
        >("feed/streamContentQuery", (data) => {
          if (typeof data === "undefined") {
            return undefined;
          }
          const newData = {
            ...data,
            entities: {
              article: {
                ...data.entities.article,
                [prevArticleId]: {
                  ...prevArticle,
                  isInnerArticleShow: false,
                },
                [articleId]: {
                  ...curArticle,
                  isInnerArticleShow: true,
                },
              },
            },
          };
          console.log(newData);
          return newData;
        });
      }
    },
    [getArticleById, state.currenActivedFeedId]
  );

  const displayArticle = useCallback(
    (articleId) => {
      if (viewType === ViewType.list) {
        openArticleInner(articleId);
      } else if (viewType !== ViewType.threeway) {
        openArticleModal();
      }
    },
    [viewType, openArticleInner]
  );

  const onClickFeed = useCallback(
    (e: FeedProps): any => {
      dispatch({ type: "feed/ById/changeCurrentActivedFeedId", payload: e.id });
      displayArticle(e.id);
    },
    [displayArticle]
  );

  const { currenActivedFeedId } = state;
  const activedArticle = getArticleById(currenActivedFeedId);

  return (
    <FeedContext.Provider
      value={{ state, dispatch, streamContents: streamContentQuery.data?.list }}
    >
      <ArticleContext.Provider value={activedArticle}>
        <FeedPageComponent
          className={className}
          article={activedArticle}
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
