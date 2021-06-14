import {
  default as React,
  useCallback,
  useEffect,
  useState,
  useContext,
  useMemo,
} from "react";
import { default as api } from "../../api";
import { FeedContext } from "../../context/feed";
import { IGroup } from "@fluentui/react";
import { FeedItem } from "./types";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { groupBy } from "lodash";
import { useMutation } from "react-query";
import { useUpdateEffect } from "react-use";
import dayjs from "dayjs";
import FeedPaneComponent from "./feedPaneComponent";
export interface Props {
  className?: string;
  getScrollParent(): any;
  currenActivedFeedId: string;
  setCurrenActivedFeedId: React.Dispatch<React.SetStateAction<string>>;
  setIsArticleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedsPane = ({
  className,
  getScrollParent,
  currenActivedFeedId,
  setCurrenActivedFeedId,
  setIsArticleModalOpen,
}: Props) => {
  const [test, setTest] = useState<string>('');
  const { viewType } = useContext(ViewTypeContext);
  const { streamContentQuery, streamContentData, setArticleDataById } =
    useContext(FeedContext);

  const openArticleInner = useCallback(
    (articleId: string, currenActivedFeedId: string) => {
      const prevArticleId: string = currenActivedFeedId;
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
    [setArticleDataById]
  );

  const closeArticleInner = (articleId: string) => {
    if (articleId !== "") {
      setArticleDataById(articleId, (article) => {
        article.isInnerArticleShow = false;
      });
    }
  };

  const displayArticle = useCallback(
    (articleId: string): void => {
      if (viewType === ViewType.list) {
        openArticleInner(articleId, currenActivedFeedId);
      } else if (viewType !== ViewType.threeway) {
        setIsArticleModalOpen(true);
      }
    },
    [openArticleInner, setIsArticleModalOpen, currenActivedFeedId, viewType]
  );

  const markAsReadMutation = useMutation(
    ({ id, asUnread }: { id: string; asUnread?: boolean }): any =>
      api.inoreader.markArticleAsRead(id, asUnread),
    {
      onMutate: ({ id }): void => {
        console.time('mutate as read');
        setArticleDataById(id, (article) => {
          article["unreadMarkButtonProps"] = { disabled: true };
        });
        console.timeEnd('mutate as read');
      },
      onSuccess: (data, { id, asUnread }) => {
        setArticleDataById(id, (article) => {
          article.isRead = !asUnread;
        });
      },
      onSettled: (data, error, { id, asUnread }) => {
        setArticleDataById(id, (article) => {
          article["unreadMarkButtonProps"] = { disabled: false };
        });
      },
    }
  );

  const markAsStarMutation = useMutation(
    ({ id, isStar }: { id: string; isStar?: boolean }): any =>
      api.inoreader.markArticleAsStar(id, isStar),
    {
      onMutate: ({ id }): void => {
        setArticleDataById(id, (article) => {
          article["starButtonProps"] = { disabled: true };
        });
      },
      onSuccess: (data, { id, isStar }) => {
        setArticleDataById(id, (article) => {
          article.isStar = isStar;
        });
      },
      onSettled: (data, error, { id, isStar }) => {
        setArticleDataById(id, (article) => {
          article["starButtonProps"] = { disabled: false };
        });
      },
    }
  );

  const handleArticleItemClick = useCallback(
    (item: FeedItem, index: number, e: any): void => {
      const articleId = item.id;
      setCurrenActivedFeedId(articleId);
      displayArticle(articleId);
      markAsReadMutation.mutate({ id: articleId, asUnread: false });
    },
    [
      displayArticle,
      markAsReadMutation,
      setCurrenActivedFeedId,
    ]
  );

  const handleArticleItemStar = (
    item: FeedItem,
    index: number,
    e: any
  ): void => {
    if (e) {
      e.stopPropagation();
    }
    markAsStarMutation.mutate({ id: item.id, isStar: !item.isStar });
  };

  const handleArticleItemRead = (
    item: FeedItem,
    index: number,
    e: any
  ): void => {
    if (e) {
      e.stopPropagation();
    }
    markAsReadMutation.mutate({ id: item.id, asUnread: item.isRead });
  };

  useUpdateEffect(() => {
    if (viewType !== ViewType.list) {
      closeArticleInner(currenActivedFeedId);
    }
  }, [viewType, currenActivedFeedId]);

  const groups = useMemo<IGroup[]>((): IGroup[] => {
    const streamContents: FeedItem[] = streamContentData;
    
    const comparePublishDate = (a, b): number => {
      const dayA = dayjs(a);
      const dayB = dayjs(b);
      return dayB.diff(dayA);
    };
    console.time('group');
    const streamContentsGrouped = groupBy(streamContents, (article) => {
      return dayjs(dayjs(article.publishedTime).format("YYYY-MM-DD")).toNow();
    });

    const keys = Object.keys(streamContentsGrouped);
    const keysOrderByPublishDate = keys.sort(comparePublishDate);
    let groupStartIndex = 0;
    const result: IGroup[] = keysOrderByPublishDate.reduce<IGroup[]>(
      (acc, cur, index) => {
        const groupElements = streamContentsGrouped[cur];
        const group = {
          key: cur,
          name: cur,
          startIndex: groupStartIndex,
          count: groupElements.length,
          isCollapsed: false,
        };
        groupStartIndex += groupElements.length;
        acc.push(group);
        return acc;
      },
      []
    );
    
    console.timeEnd('group');
    return result;
  }, [streamContentData]);

  return (
    <FeedPaneComponent
      className={className}
      currenActivedFeedId={currenActivedFeedId}
      items={streamContentData}
      groups={groups}
      handleArticleItemClick={handleArticleItemClick}
      handleArticleItemRead={handleArticleItemRead}
      handleArticleItemStar={handleArticleItemStar}
      hasNextPage={streamContentQuery.hasNextPage}
      isFetching={streamContentQuery.isFetching}
      fetchNextPage={streamContentQuery.fetchNextPage}
      getScrollParent={getScrollParent}
      viewType={viewType}
    />
  );
};

export default React.memo(FeedsPane);
