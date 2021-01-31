import React, { useContext } from "react";
import { default as FeedsPaneComponent } from "./component";
import {
  FeedProps,
  FeedGroup,
} from "./types";
import { IGroup } from "office-ui-fabric-react";

import { FeedContext } from './../../context/feed';

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
export interface Props {
  className?: string;
  onClickFeed?(e: FeedProps): any;
}

const FeedsPaneContainer = (props: Props) => {
  const { state, dispatch } = useContext(FeedContext);
  const {
    feeds: itemsProps,
    groups: groupProps,
    isSidePaneOpen,
  } = mapStoreToProps(state);
  return (
    <FeedsPaneComponent
      isSidePaneOpen={isSidePaneOpen}
      items={itemsProps}
      groups={groupProps}
      dispatch={dispatch}
      {...props}
    />
  );
};

export default FeedsPaneContainer;
