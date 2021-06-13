import { default as React, useCallback, useContext, useEffect } from "react";
import { FeedContext } from "../../context/feed";

import {
  ActionButton,
  GroupedList,
  IGroupHeaderProps,
  FontIcon,
  IGroup,
  Stack,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import InfiniteScroll from "react-infinite-scroller";

import { produce } from "immer";
import FeedItemComponent from "./feedItem";
import { FeedItem } from "./types";
import { default as api } from "../../api";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { isEmpty, get, groupBy } from "lodash";
import { useQueryClient, useMutation } from "react-query";
import { useUpdateEffect } from "react-use";
import dayjs from "dayjs";
import FeedShimmer from "./feedShimmer";
import SubscriptionInfoCard from "./subscriptionInfoCard";
export interface Props {
  className?: string;
  getScrollParent(): any;
  currenActivedFeedId: string;
  setCurrenActivedFeedId: React.Dispatch<React.SetStateAction<string>>;
  setIsArticleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrenActivedFeedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const FeedsPane = ({
  className,
  getScrollParent,
  currenActivedFeedId,
  setCurrenActivedFeedId,
  setCurrenActivedFeedIndex,
  setIsArticleModalOpen,
}: Props) => {
  const { viewType } = useContext(ViewTypeContext);
  const {
    streamContentQuery,
    streamContentData,
    setArticleDataById,
  } = useContext(FeedContext);

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

  const closeArticleInner = (articleId: string) => {
    if (articleId !== "") {
      setArticleDataById(articleId, (article) => {
        article.isInnerArticleShow = false;
      });
    }
  };

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

  const handleArticleItemClick = useCallback(
    (item: FeedItem, index: number, e: any): void => {
      const articleId = item.id;
      setCurrenActivedFeedId(articleId);
      setCurrenActivedFeedIndex(index);
      displayArticle(articleId);
      markAsReadMutation.mutate({ id: articleId, asUnread: false });
    },
    [
      displayArticle,
      markAsReadMutation,
      setCurrenActivedFeedId,
      setCurrenActivedFeedIndex,
    ]
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
  }, [viewType, currenActivedFeedId]);

  const getGroups = (streamContents: FeedItem[]): IGroup[] => {
    const streamContentsGrouped = groupBy(streamContents, (article) => {
      return dayjs(dayjs(article.publishedTime).format("YYYY-MM-DD")).toNow();
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

  const paddingHori = viewType === ViewType.threeway ? "px-4" : "px-6";

  if (!isEmpty(streamContentData)) {
    const onRenderHeader = (props?: IGroupHeaderProps): JSX.Element | null => {
      if (!props || !props.group) {
        return null;
      }
      return (
        <Stack
          horizontal
          verticalAlign="center"
          className={`pt-4 pb-2 border-t ${paddingHori}`}
        >
          <div className="flex-1 font-bold text-xl text-gray-600">
            {props.group!.name}
          </div>
        </Stack>
      );
    };

    const onRenderFooter = (): React.ReactElement | null => {
      return (
        <Stack
          className={`pt-0 pb-4 w-full ${paddingHori}`}
          horizontal
          horizontalAlign="end"
        >
          <ActionButton
            className="text-gray-500 text-base mr-0 px-0"
            styles={{ label: "m-0" }}
            text="mark this group as read"
          />
        </Stack>
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
          itemClassName={`${paddingHori}`}
          itemIndex={index}
          isSelected={item.id === currenActivedFeedId}
          onClick={handleArticleItemClick}
          onStar={handleArticleItemStar}
          onRead={handleArticleItemRead}
        />
      );
    };

    return (
      <InfiniteScroll
        getScrollParent={getScrollParent}
        className={className}
        initialLoad={false}
        loadMore={streamContentQuery.fetchNextPage}
        useWindow={false}
        hasMore={
          streamContentQuery.hasNextPage && !streamContentQuery.isFetching
        }
      >
        <div className="border-b">
          <SubscriptionInfoCard rootClassName="px-6" />
        </div>
        <GroupedList
          items={streamContentData}
          onRenderCell={onRenderCell}
          groups={getGroups(streamContentData)}
          onShouldVirtualize={() => false}
          usePageCache={true}
          groupProps={{
            onRenderHeader: onRenderHeader,
            onRenderFooter: onRenderFooter,
          }}
        />
        <div>
          {streamContentQuery.isFetching ? (
            <Spinner
              label="loading"
              size={SpinnerSize.large}
              styles={{ root: "m-auto h-32", circle: "border-2" }}
            />
          ) : null}
        </div>
      </InfiniteScroll>
    );
  } else {
    if (streamContentQuery.isFetching) {
      return (
        <div className={`${className} h-full`}>
          <FeedShimmer />
        </div>
      );
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

export default React.memo(FeedsPane);
