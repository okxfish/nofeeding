import { default as React, Dispatch } from "react";
import {
  ActionButton,
  GroupedList,
  IGroup,
  IGroupRenderProps,
  IGroupHeaderProps,
  ShimmerElementsGroup,
  ShimmerElementType,
  FontIcon,
  Shimmer,
} from "office-ui-fabric-react";
import { FeedProps } from "./types";
import "./style.css";
import FeedItem from "./feedItem";
export interface Props {
  className?: string;
  items: FeedProps[];
  isFetching: boolean;
  groups: IGroup[];
  isSidePaneOpen: boolean;
  dispatch: Dispatch<any>;
}

const FeedsPane = ({
  className,
  items,
  groups,
  isFetching,
  dispatch,
}: Props) => {
  const onRenderHeader = (props?: IGroupHeaderProps): JSX.Element | null => {
    if (props && props.group) {
      return (
        <div
          className="
           flex items-center 
           h-10 px-4 border-b
           cursor-pointer 
           text-lg text-gray-600 font-bold leading-loose
         "
        >
          <div className="flex-1">{props.group!.name}</div>
          <span className="font-normal">{props.group.count}</span>
        </div>
      );
    } else {
      return null;
    }
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

  const groupProps: IGroupRenderProps = {
    onRenderHeader: onRenderHeader,
    onRenderFooter: onRenderFooter,
  };

  const onRenderCell = (
    nestingDepth?: number | undefined,
    item?: any,
    index?: number | undefined
  ): React.ReactNode => {
    return <FeedItem item={item} itemIndex={index} />;
  };

  const getCustomElements = (number: number): JSX.Element => {
    const rowRender = (item, index): JSX.Element => (
      <div key={index}>
        <div
          style={{ width: "100%", display: "flex", alignItems: "flex-start" }}
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

    return <div>{Array.from({ length: number }).map(rowRender)}</div>;
  };

  if (isFetching && (!items || (Array.isArray(items) && items.length === 0))) {
    return (
      <Shimmer
        className="mt-4 mx-auto w-11/12"
        customElementsGroup={getCustomElements(5)}
      />
    );
  }
  if (!isFetching && Array.isArray(items) && items.length === 0) {
    return (
      <div className="text-center p-24 text-gray-300">
        <FontIcon iconName="FangBody" className="text-7xl"/>
        <div className="font-semibold text-3xl">Nothing Here</div>
      </div>
    );
  }

  return (
    <>
      <GroupedList
        className={`${className}`}
        items={items}
        onRenderCell={onRenderCell}
        onShouldVirtualize={() => true}
        groupProps={groupProps}
      />
    </>
  );
};

export default FeedsPane;
