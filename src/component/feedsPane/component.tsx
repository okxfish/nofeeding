import { default as React, Dispatch } from "react";
import {
  ActionButton,
  GroupedList,
  IGroup,
  IGroupRenderProps,
  IGroupHeaderProps,
} from "office-ui-fabric-react";
import { FeedGroup, FeedProps } from "./types";
import "./style.css";
import FeedItem from "./feedItem";
export interface Props {
  className?: string;
  onClickFeed?(e: FeedProps): void;
  items: FeedProps[];
  groups: IGroup[];
  isSidePaneOpen: boolean;
  dispatch: Dispatch<any>;
}

const mapStoreToProps = (store): any => {
  const { byId: groupsById, allId: groupsAllId } = store.groups;
  const { byId: feedsById } = store.feeds;
  const groupsEntities = groupsAllId.map((id: string) => groupsById[id]);
  const [groups, feeds] = groupsEntities.reduce(
    (
      previousValue: [IGroup[], FeedProps[]],
      currentValue: FeedGroup,
      currentIndex: number
    ): [IGroup[], FeedProps[]] => {
      return [
        reduceGroups(previousValue[0], currentValue, previousValue[1].length),
        reduceFeeds(previousValue[1], currentValue.children, currentIndex),
      ];
    },
    [[], []]
  );
  return { feeds, groups };

  function reduceGroups(
    previousValue: IGroup[],
    currentValue: FeedGroup,
    feedsLenght: number
  ): IGroup[] {
    const group = {
      key: currentValue.id,
      name: currentValue.name,
      level: 0,
      isCollapsed: false,
      children: [],
      count: currentValue.children.length,
      startIndex: feedsLenght,
    };
    previousValue.push(group);
    return previousValue;
  }

  function reduceFeeds(
    previousValue: FeedProps[],
    currentValue: string[],
    currentIndex: number
  ): FeedProps[] {
    return previousValue.concat(
      currentValue.map(
        (feedId: string): FeedProps => {
          const feedEntity = feedsById[feedId];
          return {
            ...feedEntity,
            key: feedEntity.id,
            currentIndex,
          };
        }
      )
    );
  }
};

const FeedsPane = ({
  className,
  items,
  groups,
  onClickFeed,
  dispatch
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
