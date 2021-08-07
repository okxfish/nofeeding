import React, { useCallback, useContext } from "react";
import { FeedItem } from "./types";
import FeedItemComponent from "./feedItem";
import InfiniteScroll from "react-infinite-scroller";
import { isEmpty } from "lodash";
import {
  Stack,
  Spinner,
  SpinnerSize,
  FontIcon,
  List,
  Text,
} from "@fluentui/react";
import FeedShimmer from "./feedShimmer";
import { CurrenActivedFeedIdContext, SettingContext } from "./../../context";

export interface Props {
  className?: string;
  items: FeedItem[];
  hasNextPage: boolean;
  isFetching: boolean;
  fetchNextPage(): any;
  getScrollParent(): any;
}

const FeedPaneComponent = ({
  className,
  items,
  hasNextPage,
  isFetching,
  fetchNextPage,
  getScrollParent,
}: Props) => {
  const currenActivedFeedId = useContext(CurrenActivedFeedIdContext);
  const {
    layout: { viewType },
  } = useContext(SettingContext);

  const onRenderCell = useCallback(
    (item?: FeedItem, index?: number | undefined): React.ReactNode => {
      if (typeof item === "undefined" || typeof index === "undefined") {
        return null;
      }
      return (
        <FeedItemComponent
          {...item}
          key={item.id}
          itemIndex={index}
          isSelected={item.id === currenActivedFeedId}
        />
      );
    },
    [currenActivedFeedId]
  );

  if (!isEmpty(items)) {
    return (
      <InfiniteScroll
        getScrollParent={getScrollParent}
        className={className}
        initialLoad={false}
        loadMore={fetchNextPage}
        useWindow={false}
        hasMore={hasNextPage && !isFetching}
      >
        <List<FeedItem>
          items={items}
          onRenderCell={onRenderCell}
          usePageCache={true}
        />
        <div>
          {isFetching ? (
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
    if (isFetching) {
      return (
        <div className={`${className} h-full`}>
          <FeedShimmer />
        </div>
      );
    } else {
      return (
        <Stack className="text-center p-24">
          <FontIcon iconName="FangBody" className="text-7xl" />
          <Text className="font-semibold text-xl">Nothing Here</Text>
        </Stack>
      );
    }
  }
};

export default React.memo(FeedPaneComponent, (prevProps, nextProps) => {
  if (
    prevProps.className !== nextProps.className ||
    prevProps.items !== nextProps.items ||
    prevProps.hasNextPage !== nextProps.hasNextPage ||
    prevProps.isFetching !== nextProps.isFetching ||
    prevProps.fetchNextPage !== nextProps.fetchNextPage ||
    prevProps.getScrollParent !== nextProps.getScrollParent
  ) {
    return false;
  } else {
    return true;
  }
});
