import { default as React, useCallback, useContext } from "react";
import { FeedContext } from "../../context/feed";

import {
  ActionButton,
  GroupedList,
  IGroupHeaderProps,
  FontIcon,
  IGroup,
} from "@fluentui/react";

import { produce } from "immer";
import FeedItemComponent from "./feedItem";
import { FeedItem } from "./types";
import { default as api } from "../../api";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { isEmpty, get, groupBy } from "lodash";
import { useQueryClient, useMutation } from "react-query";
import dayjs from "dayjs";
import { useUpdateEffect } from "react-use";
import FeedShimmer from "./feedShimmer";
import SubscriptionInfoCard from "./subscriptionInfoCard";
export interface Props {
  className?: string;
  currenActivedFeedId: string;
  setCurrenActivedFeedId: React.Dispatch<React.SetStateAction<string>>;
  setIsArticleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedsPane = ({
  className,
  currenActivedFeedId,
  setCurrenActivedFeedId,
  setIsArticleModalOpen,
}: Props) => {
  const { viewType } = useContext(ViewTypeContext);
  const queryClient = useQueryClient();
  const { streamContentQuery, streamContentQueryKey } = useContext(FeedContext);

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

  const openArticleInner = useCallback(
    (articleId: string) => {
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
    [currenActivedFeedId, setArticleDataById]
  );

  const closeArticleInner = useCallback(
    (articleId: string) => {
      if (articleId !== "") {
        setArticleDataById(articleId, (article) => {
          article.isInnerArticleShow = false;
        });
      }
    },
    [setArticleDataById]
  );

  const displayArticle = useCallback(
    (articleId) => {
      if (viewType === ViewType.list) {
        openArticleInner(articleId);
      } else if (viewType !== ViewType.threeway) {
        setIsArticleModalOpen(true);
      }
    },
    [viewType, openArticleInner, setIsArticleModalOpen]
  );

  const markAsReadMutation = useMutation(
    ({ id, asUnread }: { id: string; asUnread?: boolean }): any =>
      api.inoreader.markArticleAsRead(id, asUnread),
    {
      onMutate: ({ id }): void => {
        setArticleDataById(id, (article) => {
          article["unreadMarkButtonProps"] = { disabled: true };
        });
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

  const markAsRead = useCallback(
    (articleId: string): void => {
      markAsReadMutation.mutate({ id: articleId });
    },
    [markAsReadMutation]
  );

  const handleArticleItemClick = useCallback(
    (item: FeedItem, index: number, e: any): void => {
      const articleId = item.id;
      setCurrenActivedFeedId(articleId);
      displayArticle(articleId);
      markAsRead(articleId);
    },
    [displayArticle, markAsRead, setCurrenActivedFeedId]
  );

  const handleArticleItemStar = useCallback(
    (item: FeedItem, index: number, e: any): void => {
      if (e) {
        e.stopPropagation();
      }
      markAsStarMutation.mutate({ id: item.id, isStar: !item.isStar });
    },
    [markAsStarMutation]
  );

  const handleArticleItemRead = useCallback(
    (item: FeedItem, index: number, e: any): void => {
      if (e) {
        e.stopPropagation();
      }
      markAsReadMutation.mutate({ id: item.id, asUnread: item.isRead });
    },
    [markAsReadMutation]
  );

  useUpdateEffect(() => {
    if (viewType !== ViewType.list) {
      closeArticleInner(currenActivedFeedId);
    }
  }, [viewType, closeArticleInner, currenActivedFeedId]);

  const streamContents = streamContentQuery.data?.result.map(
    (feedId) => streamContentQuery.data?.entities.article[feedId]
  );

  const getGroups = (streamContents: FeedItem[]): IGroup[] => {
    const streamContentsGrouped = groupBy(streamContents, (article) => {
      return dayjs(dayjs(article.publishedTime).format("YYYY-MM-DD")).fromNow();
    });

    const comparePublishDate = (a, b): number => {
      const dayA = dayjs(a);
      const dayB = dayjs(b);
      return dayB.diff(dayA);
    };

    const getGroupByKey = (key: string) => {
      return streamContentsGrouped[key];
    };

    const getGroupName = (key: string) => {
      return key;
    };

    const keys = Object.keys(streamContentsGrouped);
    const keysOrderByPublishDate = keys.sort(comparePublishDate);
    let groupStartIndex = 0;
    const result: IGroup[] = keysOrderByPublishDate.reduce<IGroup[]>(
      (acc, cur, index) => {
        const groupElements = getGroupByKey(cur);
        const group = {
          key: cur,
          name: getGroupName(cur),
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

    return result;
  };

  if (!isEmpty(streamContents)) {
    const onRenderHeader = (props?: IGroupHeaderProps): JSX.Element | null => {
      if (!props || !props.group) {
        return null;
      }
      return (
        <div className="flex items-center h-10 px-4 border-b cursor-pointer text-lg text-gray-600 font-bold leading-loose">
          <div className="flex-1">{props.group!.name}</div>
          <span className="font-normal">{props.group.count}</span>
        </div>
      );
    };

    const onRenderFooter = (): React.ReactElement | null => {
      return (
        <div className="flex justify-end px-4 pt-4 pb-6 border-t">
          <ActionButton className="text-blue-500 text-base mr-0 px-0">
            mark this group as read
          </ActionButton>
        </div>
      );
    };

    const onRenderCell = (
      nestingDepth?: number | undefined,
      item?: any,
      index?: number | undefined
    ): React.ReactNode => {
      if (typeof item === "undefined" || typeof index === "undefined") {
        return null;
      }
      return (
        <FeedItemComponent
          data={item}
          itemIndex={index}
          isSelected={item.id === currenActivedFeedId}
          onClick={handleArticleItemClick}
          onStar={handleArticleItemStar}
          onRead={handleArticleItemRead}
        />
      );
    };

    return (
      <div className={`${className} ms-motion-slideUpIn`}>
        <div className="border-b">
          <SubscriptionInfoCard
            id="1"
            name={"Hacker News"}
            htmlUrl={"Hacker News"}
            iconUrl={"Hacker News"}
            xmlUrl={"Hacker News"}
            orderNumber={100}
            lastUpdateTime={"3d"}
            updateCycle={"3d"}
          />
        </div>
        <GroupedList
          items={streamContents}
          onRenderCell={onRenderCell}
          groups={getGroups(streamContents)}
          groupProps={{
            onRenderHeader: onRenderHeader,
            onRenderFooter: onRenderFooter,
          }}
        />
      </div>
    );
  } else {
    if (streamContentQuery.isFetching) {
      return <FeedShimmer />;
    } else {
      return (
        <div className="text-center p-24 text-gray-300">
          <FontIcon iconName="FangBody" className="text-7xl" />
          <div className="font-semibold text-3xl">Nothing Here</div>
        </div>
      );
    }
  }
};

export default FeedsPane;
