import { default as React, Dispatch } from "react";
import {
  ActionButton,
  GroupedList,
  IGroup,
  IGroupRenderProps,
  IGroupHeaderProps,
} from "office-ui-fabric-react";
import { FeedProps } from "./types";
import "./style.css";
import FeedItem from "./feedItem";
export interface Props {
  className?: string;
  onClickFeed?(e: any): void;
  items: FeedProps[];
  groups: IGroup[];
  isSidePaneOpen: boolean;
  dispatch: Dispatch<any>;
}

const FeedsPane = ({
  className,
  items,
  groups,
  onClickFeed,
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
    
    const toggleIsReadById = (e: any): void => {
      if(e && typeof e.stopPropagation === 'function'){
        e.stopPropagation();
      } 
      dispatch({ type: "feed/ById/toggleIsRead", payload: item.key });
    };

    const toggleIsStarById = (e: any): void => {
      if(e && typeof e.stopPropagation === 'function'){
        e.stopPropagation();
      } 
      dispatch({ type: "feed/ById/toggleIsStar", payload: item.key });
    };

    const toggleIsPinById = (e: any): void => {
      if(e && typeof e.stopPropagation === 'function'){
        e.stopPropagation();
      } 
      dispatch({ type: "feed/ById/toggleIsPin", payload: item.key });
    };

    return (
      <FeedItem
        item={item}
        itemIndex={index}
        onClickFeed={onClickFeed}
        onPinClick={toggleIsPinById}
        onStarClick={toggleIsStarById}
        onReadClick={toggleIsReadById}
        onLeftSlide={toggleIsReadById}
        onRightSlide={toggleIsStarById}
      />
    );
  };

  return (
    <>
      <GroupedList
        className={`${className}`}
        items={items}
        onRenderCell={onRenderCell}
        onShouldVirtualize={() => false}
        groupProps={groupProps}
        groups={groups}
      />
    </>
  );
};

export default FeedsPane;
