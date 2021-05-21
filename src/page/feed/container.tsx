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

import { produce } from "immer";

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
  const streamId = useSearchParam("streamId") || "";
  const unreadOnly = useSearchParam("unreadOnly") || "0";

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

  const setArticleDataById = useCallback(
    (articleId: string, updater: any): void =>
      queryClient.setQueryData(
        ["feed/streamContentQuery", streamId, unreadOnly],
        produce((data) => {
          const articles = get(data, `entities.article`);
          console.log(articles);
          const article = get(data, `entities.article['${articleId}']`);
          if (typeof article !== "undefined") {
            updater(article);
          }
        })
      ),
    [queryClient, streamId, unreadOnly]
  );

  const toggleReadById = useCallback(
    (articleId: string) => {
      setArticleDataById(articleId, (article) => {
        article.isRead = !article.isRead;
      });
    },
    [setArticleDataById]
  );

  const toggleStarById = useCallback(
    (articleId: string) => {
      setArticleDataById(articleId, (article) => {
        article.isStar = !article.isStar;
      });
    },
    [setArticleDataById]
  );

  const filterImgSrcfromHtmlStr =(htmlStr) => {
    const imgReg = /<img.*?(?:>|\/>)/i;
    const srcReg = /src=['"]?([^'"]*)['"]?/i;
    const imgs = htmlStr.match(imgReg);
    if (Array.isArray(imgs) && imgs.length > 0) {
      return imgs[0].match(srcReg)[1]
    }else {
      return '';
    }
  }

  const streamContentQuery = useQuery<
    NormalizedSchema<{ article: { [key: string]: FeedProps } }, string[]>
  >(
    ["feed/streamContentQuery", streamId, unreadOnly],
    async ({queryKey: [key, streamId, unreadOnly]}) => {
      const { data } = await api.inoreader.getStreamContents(String(streamId), {
        exclude: unreadOnly === "1" ? SystemStreamIDs.READ : "",
      });
      const transformedData = data.items.map((item) => {
        return ({
          key: item.id,
          id: item.id,
          title: item.title,
          summary: "",
          thumbnailSrc: filterImgSrcfromHtmlStr(item.summary.content),
          content: item.summary.content,
          sourceName: item.origin.title,
          sourceID: item.origin.title.streamId,
          url: item.canonical[0].href,
          time: item.timestampUsec,
          isRead: false,
          isStar: false,
          isPin: false,
          isInnerArticleShow: false,
          onStarClick: (e: any) => {
            if (e) {
              e.stopPropagation();
            }
            toggleStarById(item.id);
          },
          onReadClick: (e: any) => {
            if (e) {
              e.stopPropagation();
            }
            toggleReadById(item.id);
          },
          closeInnerArticle: (e: any) => {
            setArticleDataById(item.id, (article) => {
              article.isInnerArticleShow = false;
            });
          },
        })
      });
      const normalizeData = normalize<
        FeedProps,
        { article: { [key: string]: FeedProps } },
        string[]
      >(transformedData, [article]);
      return normalizeData;
    },
    {
      onError: (error) => {
        console.error(error);
      },
      placeholderData: { entities: { article: {} }, result: [] },
      refetchOnWindowFocus: false,
    }
  );

  const getArticleById = useCallback(
    (id) => get(streamContentQuery.data, `entities.article['${id}']`),
    [streamContentQuery.data]
  );

  const openArticleInner = useCallback(
    (articleId: string) => {
      const prevArticleId: string = state.currenActivedFeedId;
      if (prevArticleId !== articleId) {
        if (prevArticleId !== "") {
          setArticleDataById(prevArticleId, (article) => {
            article.isInnerArticleShow = false;
          });
        }
        setArticleDataById(articleId, (article) => {
          article.isInnerArticleShow = true;
        });
      } else {
        setArticleDataById(articleId, (article) => {
          article.isInnerArticleShow = false;
        });
      }
    },
    [state.currenActivedFeedId, setArticleDataById]
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

  const markAsRead = useCallback(
    (articleId: string) =>
      setArticleDataById(articleId, (article) => {
        article.isRead = true;
      }),
    [setArticleDataById]
  );

  const onClickFeed = useCallback(
    (e: FeedProps): any => {
      const articleId = e.id;
      dispatch({
        type: "feed/ById/changeCurrentActivedFeedId",
        payload: articleId,
      });
      displayArticle(articleId);
      markAsRead(articleId);
    },
    [displayArticle, markAsRead]
  );

  const { currenActivedFeedId } = state;
  const activedArticle = getArticleById(currenActivedFeedId);

  const streamContents = streamContentQuery.data?.result.map(
    (feedId) => streamContentQuery.data?.entities.article[feedId]
  );

  return (
    <FeedContext.Provider
      value={{ state, dispatch, streamContents: streamContents }}
    >
      <ArticleContext.Provider value={activedArticle}>
        <FeedPageComponent
          className={className}
          article={activedArticle}
          viewType={viewType}
          isArticleModalOpen={isArticleModalOpen}
          isOverViewPaneOpen={isOverViewPaneOpen}
          isFetching={streamContentQuery.isFetching}
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
