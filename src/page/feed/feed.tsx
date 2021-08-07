import React, { useRef, useMemo, useContext, useCallback } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";

import { FeedItem, FeedProps } from "./types";

import { filterImgSrcfromHtmlStr } from "./utils";
import { default as api } from "../../api";
import { StreamContentsResponse, SystemStreamIDs } from "../../api/inoreader";

import { normalize, NormalizedSchema, schema } from "normalizr";
import { Dayjs, default as dayjs } from "dayjs";
import classnames from "classnames";

import { Modal } from "@fluentui/react";

import ArticlePane from "./articlePane";
import FeedsPane from "./feedsPane";
import OverviewPane from "./overviewPane";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import { produce } from "immer";
import { ViewType } from "../../context/setting";
import {
  CurrenActivedFeedIdContext,
  DispatchContext,
  StoreContext,
  SettingContext,
  FeedContext,
  SetFeedItemContext,
  ArticleContext,
} from "./../../context";
import "./style.css";
import { useThemeStyles } from "../../theme";

const article = new schema.Entity<FeedProps>("article");
interface ArticleEntitySchema {
  article: {
    [key: string]: any;
  };
}

interface InfiniteNormalizedArticles
  extends NormalizedSchema<ArticleEntitySchema, string[]> {
  continuation: string;
}

const FeedContainer = () => {
  const { isArticleModalOpen } = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);
  const currenActivedFeedId = useContext(CurrenActivedFeedIdContext);
  const {
    layout: { viewType },
    feed: { unreadOnly },
  } = useContext(SettingContext);
  const scrollParentRef = useRef<any>(null);
  const location = useLocation();
  const queryClient = useQueryClient();
  const qs = queryString.parse(location.search);
  const streamId = qs.streamId;
  const { contentLayer } = useThemeStyles();

  const streamContentQueryKey = useMemo(
    () => ["feed/streamContentQuery", streamId, unreadOnly],
    [streamId, unreadOnly]
  );

  const resolveResponse = (data: StreamContentsResponse): FeedItem[] => {
    return data.items.map((item, index) => {
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
  };

  // 从服务器获取 feed 流，并且将响应数据转换成组件的状态，将数据范式化
  const streamContentQuery = useInfiniteQuery<InfiniteNormalizedArticles>(
    streamContentQueryKey,
    async ({
      queryKey: [key, streamId = "", unreadOnly],
      pageParam = "",
    }): Promise<InfiniteNormalizedArticles> => {
      const exclude = unreadOnly ? SystemStreamIDs.READ : "";
      const res = await api.inoreader.getStreamContents(String(streamId), {
        exclude: exclude,
        continuation: pageParam,
      });

      const newNormalizedArticles = normalize<any, ArticleEntitySchema>(
        resolveResponse(res.data),
        [article]
      );
      return {
        ...newNormalizedArticles,
        continuation: res.data.continuation,
      };
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.continuation;
      },
    }
  );

  const getArticleById = (id: string, data: any) => {
    if (typeof data === "undefined" || !Array.isArray(data.pages)) {
      return null;
    }

    const pageResult = data.pages.find((page) => {
      if (page.entities.article) {
        return id in page.entities.article;
      } else {
        return false;
      }
    });

    if (pageResult) {
      return pageResult.entities.article[id];
    } else {
      return null;
    }
  };

  const setArticleDataById = useCallback(
    (id, updater) => {
      queryClient.setQueryData(
        streamContentQueryKey,
        produce((data) => {
          const article = getArticleById(id, data);
          if (article) {
            updater(article);
          }
        })
      );
    },
    [queryClient, streamContentQueryKey]
  );

  let streamContentData: any[] = [];

  if (streamContentQuery.data) {
    streamContentData = streamContentQuery.data.pages
      .map((pages, index) => {
        const {
          entities: { article },
          result,
        } = pages;
        return result.map((id) => ({
          ...article[id],
        }));
      })
      .reduce((acc, cur) => [...acc, ...cur], []);
  }

  const activedArticle: FeedItem | null = getArticleById(
    currenActivedFeedId,
    streamContentQuery.data
  );

  const getScrollParent = useCallback(() => scrollParentRef.current, []);

  return (
    <FeedContext.Provider
      value={{
        streamContentQuery,
        streamContentData,
        streamContentQueryKey,
      }}
    >
      <SetFeedItemContext.Provider value={setArticleDataById}>
        <ArticleContext.Provider value={activedArticle}>
          <div
            className={classnames(
              "hidden sm:block overflow-y-scroll scrollbar-none transition-all w-72 px-2"
            )}
          >
            <OverviewPane />
          </div>
          <div
            ref={scrollParentRef}
            className={classnames(
              "fread-feed-page__main-col overflow-y-scroll scrollbar h-full w-full sm:w-128 transition-all",
              {
                "flex-1": viewType !== ViewType.threeway,
              },
              contentLayer
            )}
            data-is-scrollable
          >
            <FeedsPane
              className={classnames("", {
                "mx-auto": viewType !== ViewType.list,
              })}
              getScrollParent={getScrollParent}
            />
          </div>
          {viewType === ViewType.threeway && (
            <div
              className={classnames("flex-1", contentLayer)}
              style={{
                minWidth: "32rem",
              }}
            >
              <ArticlePane className="h-full" />
            </div>
          )}

          <Modal
            className=""
            isOpen={isArticleModalOpen}
            onDismiss={() => dispatch({ type: "CLOSE_AIRTICLE_MODAL" })}
            isBlocking={false}
            styles={{
              main: [
                { maxHeight: "100%", maxWidth: "100%" },
              ],
            }}
          >
            <ArticlePane
              className="article-modal h-screen w-screen"
              closeModal={() => dispatch({ type: "CLOSE_AIRTICLE_MODAL" })}
            />
          </Modal>
        </ArticleContext.Provider>
      </SetFeedItemContext.Provider>
    </FeedContext.Provider>
  );
};

export default React.memo(FeedContainer);
