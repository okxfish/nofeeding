import React, { useMemo, useState, useContext } from "react";
import { useSearchParam } from "../../utils/useSearchParma";
import { useQuery } from "react-query";

import { ArticleContext } from "../../context/article";
import { FeedContext } from "../../context/feed";
import { ViewType, ViewTypeContext } from "../../context/viewType";

import { FeedItem, FeedProps } from "./types";

import { filterImgSrcfromHtmlStr } from "./utils";
import { default as api } from "../../api";
import { StreamContentsResponse, SystemStreamIDs } from "../../api/inoreader";

import { get } from "lodash";
import { normalize, NormalizedSchema, schema } from "normalizr";
import { Dayjs, default as dayjs } from "dayjs";
import classnames from "classnames";

import { Modal } from "@fluentui/react";

import ArticlePane from "./articlePane";
import FeedsPane from "./feedsPane";
import OverviewPane from "./overviewPane";
import "./style.css";
import { NeutralColors } from "@fluentui/theme";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

const article = new schema.Entity<FeedProps>("article");

export interface Props {
  isOverViewPaneOpen: boolean;
}

interface ArticleEntity {
  article: { [key: string]: FeedProps };
}

const FeedContainer = ({ isOverViewPaneOpen }) => {
  const [currenActivedFeedId, setCurrenActivedFeedId] = useState<string>("");
  const [currenActivedFeedIndex, setCurrenActivedFeedIndex] =
    useState<number>(-1);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const { viewType } = useContext(ViewTypeContext);
  const location = useLocation();
  const qs = queryString.parse(location.search);
  const streamId = qs.streamId || "";
  const unreadOnly = qs.unreadOnly || "0";

  const streamContentQueryKey = useMemo(
    () => ["feed/streamContentQuery", streamId, unreadOnly],
    [streamId, unreadOnly]
  );

  const resolveStreamContent = (data: StreamContentsResponse) => {
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
  };

  // 从服务器获取 feed 流，并且将响应数据转换成组件的状态，将数据范式化
  const streamContentQuery = useQuery<
    NormalizedSchema<ArticleEntity, string[]>
  >(
    streamContentQueryKey,
    async ({ queryKey: [key, streamId, unreadOnly] }) => {
      const exclude = unreadOnly === "1" ? SystemStreamIDs.READ : "";
      const { data } = await api.inoreader.getStreamContents(String(streamId), {
        exclude: exclude,
      });
      return resolveStreamContent(data);
    },
    {
      placeholderData: { entities: { article: {} }, result: [] },
      refetchOnWindowFocus: false,
    }
  );

  const activedArticle: FeedItem | null = get(
    streamContentQuery.data,
    `entities.article['${currenActivedFeedId}']`,
    null
  );

  return (
    <FeedContext.Provider value={{ streamContentQuery, streamContentQueryKey }}>
      <ArticleContext.Provider value={activedArticle}>
        <div
          className={classnames(
            "hidden sm:block border-r overflow-y-scroll scrollbar-none transition-all",
            {
              "w-0": isOverViewPaneOpen,
            }
          )}
          style={{ backgroundColor: NeutralColors.gray10 }}
        >
          <OverviewPane />
        </div>
        <div
          className="overflow-scroll scrollbar h-full bg-gray-100 max-w-xl w-full"
          data-is-scrollable
        >
          <FeedsPane
            className="transition-all"
            currenActivedFeedId={currenActivedFeedId}
            setCurrenActivedFeedId={setCurrenActivedFeedId}
            setCurrenActivedFeedIndex={setCurrenActivedFeedIndex}
            setIsArticleModalOpen={setIsArticleModalOpen}
          />
        </div>
        {viewType === ViewType.threeway && (
          <div className="hidden xl:block">
            <ArticlePane className="h-full" />
          </div>
        )}
        <Modal
          className=""
          isOpen={isArticleModalOpen}
          onDismiss={() => setIsArticleModalOpen(false)}
          isBlocking={false}
          styles={{
            main: [{ maxHeight: "100%" }],
          }}
        >
          <ArticlePane
            className="article-modal h-screen w-screen"
            closeModal={() => setIsArticleModalOpen(false)}
          />
        </Modal>
      </ArticleContext.Provider>
    </FeedContext.Provider>
  );
};

export default FeedContainer;
