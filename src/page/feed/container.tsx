import React, {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import { FeedItem, FeedProps } from "../../component/feedsPane/types";

import { normalize, NormalizedSchema, schema } from "normalizr";

import { initState, reducer } from "./reducer";
import { filterImgSrcfromHtmlStr } from "./utils";

import { default as get } from "lodash.get";
import { SystemStreamIDs } from "../../api/inoreader";

import { produce } from "immer";
import { Dayjs, default as dayjs } from "dayjs";

export interface Props {
  className?: string;
  isOverViewPaneOpen: boolean;
  setIsOverViewPaneOpen: React.Dispatch<SetStateAction<boolean>>;
}

const article = new schema.Entity<FeedProps>("article");

interface ArticleEntity {
  article: { [key: string]: FeedProps };
}

const FeedContainer = ({
  isOverViewPaneOpen,
  setIsOverViewPaneOpen,
}: Props) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const { viewType } = useContext(ViewTypeContext);
  const location = useLocation();

  const streamId = useSearchParam("streamId") || "";
  const unreadOnly = useSearchParam("unreadOnly") || "0";

  const closeOverviewPane = useCallback(
    () => setIsOverViewPaneOpen(false),
    [setIsOverViewPaneOpen]
  );

  // 打开文章弹窗
  const openArticleModal = (): void => setIsArticleModalOpen(true);
  // 关闭文章弹窗
  const closeArticleModal = (): void => setIsArticleModalOpen(false);

  // 切换当前的订阅源的时候关闭订阅源选择菜单
  useEffect(() => {
    closeOverviewPane();
  }, [location.search, closeOverviewPane]);

  const streamContentQueryKey = useMemo(
    () => ["feed/streamContentQuery", streamId, unreadOnly],
    [streamId, unreadOnly]
    );
    // 从服务器获取 feed 流，并且将响应数据转换成组件的状态，将数据范式化
  const streamContentQuery = useQuery<
    NormalizedSchema<ArticleEntity, string[]>
  >(
    streamContentQueryKey,
    async ({ queryKey: [key, streamId, unreadOnly] }) => {
      const { data } = await api.inoreader.getStreamContents(String(streamId), {
        exclude: unreadOnly === "1" ? SystemStreamIDs.READ : "",
      });

      const transformedData: FeedItem[] = data.items.map((item, index) => {
        const publishedTime: Dayjs = dayjs.unix(item.published);
        const thumbnailSrc = filterImgSrcfromHtmlStr(item.summary.content);
        return {
          id: item.id,
          title: item.title,
          summary: "",
          thumbnailSrc: thumbnailSrc,
          content: item.summary.content,
          sourceName: item.origin.title,
          sourceID: item.origin.streamId,
          url: item.canonical[0].href,
          publishedTime: publishedTime,
          isRead: false,
          isStar: false,
          isInnerArticleShow: false,
        };
      });

      const normalizeData = normalize<FeedProps, ArticleEntity, string[]>(
        transformedData,
        [article]
      );
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

  const queryClient = useQueryClient();
  // 通过文章的 id 修改对应的文章实体的属性
  const setArticleDataById = useCallback(
    (articleId: string, updater: any): void =>
      queryClient.setQueryData(
        streamContentQueryKey,
        produce((data) => {
          const article = get(data, `entities.article['${articleId}']`);
          if (typeof article !== "undefined") {
            updater(article);
          }
        })
      ),
    [queryClient, streamContentQueryKey]
  );

  // 切换文章的是否已读状态
  const toggleReadById = useCallback(
    (articleId: string) => {
      setArticleDataById(articleId, (article) => {
        article.isRead = !article.isRead;
      });
    },
    [setArticleDataById]
  );

  // 切换文章的是否加星状态
  const toggleStarById = useCallback(
    (articleId: string) => {
      setArticleDataById(articleId, (article) => {
        article.isStar = !article.isStar;
      });
    },
    [setArticleDataById]
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
          article.isInnerArticleShow = !article.isInnerArticleShow;
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

  const handleArticleItemClick = useCallback(
    (item, index, e) => {
      const articleId = item.id;
      dispatch({
        type: "feed/ById/changeCurrentActivedFeedId",
        payload: articleId,
      });
      displayArticle(articleId);
      markAsRead(articleId);
    },
    [displayArticle, markAsRead]
  );

  const handleArticleItemStar = useCallback(
    (item, index, e) => {
      if (e) {
        e.stopPropagation();
      }
      toggleStarById(item.id);
    },
    [toggleStarById]
  );

  const handleArticleItemRead = useCallback(
    (item, index, e) => {
      if (e) {
        e.stopPropagation();
      }
      toggleReadById(item.id);
    },
    [toggleReadById]
  );

  const handleArticleItemInnerArticleClose = useCallback(
    (item, index, e) => {
      setArticleDataById(item.id, (article) => {
        article.isInnerArticleShow = false;
      });
    },
    [setArticleDataById]
  );

  const { currenActivedFeedId } = state;
  const activedArticle = get(
    streamContentQuery.data,
    `entities.article['${currenActivedFeedId}']`
  );

  return (
    <FeedContext.Provider
      value={{ state, dispatch, streamContentQuery: streamContentQuery }}
    >
      <ArticleContext.Provider value={activedArticle}>
        <FeedPageComponent
          isArticleModalOpen={isArticleModalOpen}
          isOverViewPaneOpen={isOverViewPaneOpen}
          closeOverviewPane={closeOverviewPane}
          closeArticleModal={closeArticleModal}
          onFeedClick={handleArticleItemClick}
          onFeedStar={handleArticleItemStar}
          onFeedRead={handleArticleItemRead}
        />
      </ArticleContext.Provider>
    </FeedContext.Provider>
  );
};

export default FeedContainer;
