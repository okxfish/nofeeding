import React, { useReducer } from "react";
import { default as FeedsPaneComponent } from "./component";
import {
  FeedProps,
  FeedGroup,
  Feed,
  DataInStore,
  ObejectWithId,
} from "./types";
import { IGroup } from "office-ui-fabric-react";

import feedsMockData from "../../mock/feed";

function storeData<T extends ObejectWithId>(items: T[]): DataInStore<T> {
  const result = items.reduce(
    (previousValue: DataInStore<T>, currentValue: T): DataInStore<T> => {
      previousValue["byId"][currentValue.id] = currentValue;
      previousValue["allId"].push(currentValue.id);
      return previousValue;
    },
    { byId: {}, allId: [] }
  );
  return result;
}

const initStore = (): any => {
  const staticState: any = { isSidePaneOpen: false };
  const groupedfeedsEntities: FeedGroup[] = feedsMockData;

  const groupsInStore: DataInStore<FeedGroup> = storeData<FeedGroup>(
    groupedfeedsEntities.map(
      (group: FeedGroup): FeedGroup => ({
        ...group,
        children: group.children.map((feed: Feed): string => feed.id),
      })
    )
  );

  const feedsArray: Feed[] = groupedfeedsEntities.reduce(
    (previousValue: Feed[], currentValue: FeedGroup): Feed[] => {
      return previousValue.concat(currentValue.children);
    },
    []
  );

  const feedsInStore: DataInStore<Feed> = storeData<Feed>(feedsArray);
  return {
    ...staticState,
    groups: groupsInStore,
    feeds: feedsInStore,
  };
};

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

const reducer = (state, action) => {
  const updateFeedById = (handleFeed): any => {
    let result = { ...state };
    result.feeds.byId[action.payload] = handleFeed(
      result.feeds.byId[action.payload]
    );
    return result;
  };

  switch (action.type) {
    case "feed/ById/toggleIsRead":
      return updateFeedById((feed: Feed) => ({
        ...feed,
        isRead: !feed.isRead,
      }));
    case "feed/ById/toggleIsStar":
      return updateFeedById((feed: Feed) => ({
        ...feed,
        isStar: !feed.isStar,
      }));
    case "feed/ById/toggleIsPin":
      return updateFeedById((feed: Feed) => ({ ...feed, isPin: !feed.isPin }));
    case "sidePane/open":
      return { ...state, isSidePaneOpen: true };
    default:
      throw new Error();
  }
};

const store = initStore();

export interface Props {
  className?: string;
  onClickFeed?(): any;
}

const FeedsPaneContainer = ({ className, ...rest }: Props) => {
  const [state, dispatch] = useReducer(reducer, store);
  const {
    feeds: itemsProps,
    groups: groupProps,
    isSidePaneOpen,
  } = mapStoreToProps(state);
  return (
    <FeedsPaneComponent
      className={className}
      isSidePaneOpen={isSidePaneOpen}
      items={itemsProps}
      groups={groupProps}
      dispatch={dispatch}
      {...rest}
    />
  );
};

export default FeedsPaneContainer;
