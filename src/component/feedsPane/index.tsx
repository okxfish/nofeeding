import { default as React, useContext } from "react";
import { FeedContext } from "./../../context/feed";

import {
  ActionButton,
  GroupedList,
  IGroupHeaderProps,
  ShimmerElementsGroup,
  ShimmerElementType,
  FontIcon,
  Shimmer,
} from "@fluentui/react";

import FeedItemComponent from "./feedItem";
import { FeedItem } from "./types";

import { isEmpty } from "lodash";

export interface Props {
  className?: string;
  onFeedClick?(item: FeedItem, index: number, e: any): void;
  onFeedStar?(item: FeedItem, index: number, e: any): void;
  onFeedRead?(item: FeedItem, index: number, e: any): void;
}

const FeedsPane = ({
  className,
  onFeedClick = () => {},
  onFeedStar = () => {},
  onFeedRead = () => {},
}: Props) => {
  const { streamContentQuery } = useContext(FeedContext);

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
          onClick={onFeedClick}
          onStar={onFeedStar}
          onRead={onFeedRead}
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
