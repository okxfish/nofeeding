import React, { useMemo, useState, useContext } from "react";
import { useSearchParam } from "../../utils/useSearchParma";
import { useQuery } from "react-query";

import { ArticleContext } from "../../context/article";
import { FeedContext } from "../../context/feed";
import { ViewType, ViewTypeContext } from "../../context/viewType";

import { FeedItem, FeedProps } from "./types";

import { filterImgSrcfromHtmlStr } from "./utils";
import { default as api } from "../../api";
import { SystemStreamIDs } from "../../api/inoreader";

import { get } from "lodash";
import { normalize, NormalizedSchema, schema } from "normalizr";
import { Dayjs, default as dayjs } from "dayjs";
import classnames from "classnames";

import { Modal } from "@fluentui/react";

import ArticlePane from "./articlePane";
import FeedsPane from "./feedsPane";
import OverviewPane from "./overviewPane";
import "./style.css";

const article = new schema.Entity<FeedProps>("article");

interface ArticleEntity {
  article: { [key: string]: FeedProps };
}

const FeedContainer = () => {
  const [currenActivedFeedId, setCurrenActivedFeedId] = useState<string>("");
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const { viewType } = useContext(ViewTypeContext);
  const streamId = useSearchParam("streamId") || "";
  const unreadOnly = useSearchParam("unreadOnly") || "0";

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

  const activedArticle:FeedItem | null = get(
    streamContentQuery.data,
    `entities.article['${currenActivedFeedId}']`,
    null
  );

  return (
    <FeedContext.Provider value={{ streamContentQuery, streamContentQueryKey }}>
      <ArticleContext.Provider value={activedArticle}>
      <div className="flex items-center justify-between z-30 row-start-1 row-span-1 col-start-1 col-span-4 border-b border-gray-200 sm:hidden"></div>
      <div className="hidden sm:block row-start-1 row-span-3 col-start-1 col-span-4 sm:col-span-1 sm:col-start-2 border-r">
        <OverviewPane className="bg-white rounded-t-2xl pt-6 px-2 sm:rounded-none sm:pt-0 h-full" />
      </div>
      <div
        className={classnames(
          "overflow-scroll scrollbar h-full col-start-1 col-span-4 row-start-2 row-span-1 sm:col-start-3 sm:col-span-2 sm:row-start-1 sm:row-span-3",
          { "xl:col-span-1": viewType === ViewType.threeway }
        )}
        data-is-scrollable
      >
        <FeedsPane
          className="h-full transition-all"
          currenActivedFeedId={currenActivedFeedId}
          setCurrenActivedFeedId={setCurrenActivedFeedId}
          setIsArticleModalOpen={setIsArticleModalOpen}
        />
      </div>
      {viewType === ViewType.threeway && (
        <div className="hidden col-start-4 col-span-1 row-start-1 row-span-3 xl:block xl:col-start-4 xl:col-span-1">
          <ArticlePane className="h-full" />
        </div>
      )}
      <Modal
        className=""
        isOpen={isArticleModalOpen}
        onDismiss={()=>setIsArticleModalOpen(false)}
        overlay={{ style: { backgroundColor: "rgba(0, 0, 0, 0.75)" } }}
        isBlocking={false}
        styles={{ main: { maxHeight: "100%", maxWidth: "100%" } }}
      >
        <ArticlePane
          className="article-modal h-screen w-screen"
          closeModal={()=>setIsArticleModalOpen(false)}
        />
      </Modal>
      </ArticleContext.Provider>
    </FeedContext.Provider>
  );
};

export default FeedContainer;
