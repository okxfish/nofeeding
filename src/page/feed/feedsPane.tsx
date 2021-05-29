import { default as React, useCallback, useContext } from "react";
import { FeedContext } from "../../context/feed";

import {
  ActionButton,
  GroupedList,
  IGroupHeaderProps,
  ShimmerElementsGroup,
  ShimmerElementType,
  FontIcon,
  Shimmer,
} from "@fluentui/react";

import { produce } from "immer";
import FeedItemComponent from "./feedItem";
import { FeedItem } from "./types";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { isEmpty, get } from "lodash";
import { useQueryClient } from 'react-query';
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


  const markAsRead = useCallback(
    (articleId: string) =>
      setArticleDataById(articleId, (article) => {
        article.isRead = true;
      }),
    [setArticleDataById]
  );

  const handleArticleItemClick = useCallback(
  (item: FeedItem, index: number, e: any): void => {
      const articleId = item.id;
      setCurrenActivedFeedId(articleId)
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
      toggleStarById(item.id);
    },
    [toggleStarById]
  );

  const handleArticleItemRead = useCallback(
    (item: FeedItem, index: number, e: any): void => {
      if (e) {
        e.stopPropagation();
      }
      toggleReadById(item.id);
    },
    [toggleReadById]
  );

  const streamContents = streamContentQuery.data?.result.map(
    (feedId) => streamContentQuery.data?.entities.article[feedId]
  );

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
      <GroupedList
        className={`${className}`}
        items={streamContents}
        onRenderCell={onRenderCell}
        groupProps={{
          onRenderHeader: onRenderHeader,
          onRenderFooter: onRenderFooter,
        }}
      />
    );
  } else {
    if (streamContentQuery.isFetching) {
      const shimmerRowRender = (item, index): JSX.Element => (
        <div key={index}>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <ShimmerElementsGroup
              shimmerElements={[
                { type: ShimmerElementType.line, height: 100, width: 100 },
                { type: ShimmerElementType.gap, width: 10, height: 100 },
              ]}
            />
            <ShimmerElementsGroup
              flexWrap
              width={"calc(100% - 110px)"}
              shimmerElements={[
                { type: ShimmerElementType.line, width: "20%", height: 20 },
                { type: ShimmerElementType.gap, width: "80%", height: 20 },
                { type: ShimmerElementType.gap, width: "100%" },
                { type: ShimmerElementType.line, width: "100%", height: 20 },
                { type: ShimmerElementType.gap, width: "100%" },
                { type: ShimmerElementType.line, width: "100%", height: 20 },
              ]}
            />
          </div>
          <ShimmerElementsGroup
            shimmerElements={[
              { type: ShimmerElementType.gap, height: 24, width: "100%" },
            ]}
          />
        </div>
      );

      const getCustomElements = (number: number): JSX.Element => {
        return (
          <div>{Array.from({ length: number }).map(shimmerRowRender)}</div>
        );
      };

      return (
        <Shimmer
          className="mt-4 mx-auto w-11/12"
          customElementsGroup={getCustomElements(5)}
        />
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

export default FeedsPane;
