import React, { useContext } from "react";
import { FeedItem } from "./types";
import FeedItemComponent from "./feedItem";
import InfiniteScroll from "react-infinite-scroller";
import { isEmpty } from "lodash";
import {
  Stack,
  ActionButton,
  GroupedList,
  IGroup,
  IGroupHeaderProps,
  Spinner,
  SpinnerSize,
  FontIcon,
  Text,
} from "@fluentui/react";
import FeedShimmer from "./feedShimmer";
import { CurrenActivedFeedIdContext, SettingContext } from "./../../context";

export interface Props {
  className?: string;
  items: FeedItem[];
  groups?: IGroup[];
  hasNextPage: boolean;
  isFetching: boolean;
  fetchNextPage(): any;
  getScrollParent(): any;
}

const FeedPaneComponent = ({
  className,
  items,
  groups,
  hasNextPage,
  isFetching,
  fetchNextPage,
  getScrollParent,
}: Props) => {
  const currenActivedFeedId = useContext(CurrenActivedFeedIdContext);
  const {
    layout: { viewType },
  } = useContext(SettingContext);

  const paddingHori = 'px-6';

  if (!isEmpty(items)) {
    const onRenderHeader = (props?: IGroupHeaderProps): JSX.Element | null => {
      if (!props || !props.group) {
        return null;
      }
      return (
        <Stack
          horizontal
          verticalAlign="center"
          className={`pt-4 pb-2 ${paddingHori}`}
        >
          <div className="flex-1 font-bold text-xl">
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
            className="text-base mr-0 px-0"
            styles={{ label: "m-0" }}
            text="mark this group as read"
          />
        </Stack>
      );
    };

    const onRenderCell = (
      nestingDepth?: number | undefined,
      item?: FeedItem,
      index?: number | undefined
    ): React.ReactNode => {
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
    };
    return (
      <InfiniteScroll
        getScrollParent={getScrollParent}
        className={className}
        initialLoad={false}
        loadMore={fetchNextPage}
        useWindow={false}
        hasMore={hasNextPage && !isFetching}
      >
        <GroupedList
          items={items}
          onRenderCell={onRenderCell}
          groups={groups}
          usePageCache={true}
          groupProps={{
            onRenderHeader: onRenderHeader,
            onRenderFooter: onRenderFooter,
          }}
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
    prevProps.groups !== nextProps.groups ||
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
