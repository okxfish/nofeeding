import React, { useState, useReducer } from "react";
import { default as FeedsPaneComponent } from "./component";
import {
  FeedProps,
  FeedGroup,
  Feed,
  DataInStore,
  ObejectWithId,
} from "./types";
import { IGroup } from "office-ui-fabric-react";

const fullSummary: string =
  "this is rss summary at next but not last, you need to do a lot of things to make the world in better place. as people say, time is gold, nobody can reject the air.";

const createItems = (count: number, idBase: number): Feed[] => {
  return Array.from({
    length: count,
  }).map(
    (item:any, index:number): Feed => {
      const rdBase: number = 100;
      const rdNumber: number = Math.floor(Math.random() * rdBase);
      const rdBool: boolean = rdNumber / rdBase > 0.5;
      return {
        id: String(idBase + index),
        title: `this is rss source: ${rdNumber}`,
        summary: fullSummary.slice(rdNumber),
        thumbnailSrc: "",
        sourceName: "some news",
        sourceID: "",
        time: "3 days",
        isRead: rdBool,
        isStar: rdBool,
        isPin: rdBool,
      };
    }
  );
};

const createGroupsData = (count: number, size: number): FeedGroup[] => {
  return Array.from({
    length: count,
  }).map((): any => {
    const rdBase: number = 1000;
    const rdNumber: number = Math.floor(Math.random() * rdBase);
    return {
      id: rdNumber,
      name: `Group (${rdNumber})`,
      children: createItems(size, rdBase),
    };
  });
};

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
  const groupedfeedsEntities: FeedGroup[] = createGroupsData(3, 3);
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
    result.feeds.byId[action.payload] = handleFeed(result.feeds.byId[action.payload]);
    return result;
  };

  switch (action.type) {
    case "feed/ById/toggleIsRead":
      return updateFeedById((feed:Feed)=>({...feed, isRead: !feed.isRead}));
    case "feed/ById/toggleIsStar":
      return updateFeedById((feed:Feed)=>({...feed, isStar: !feed.isStar}));;
    case "feed/ById/toggleIsPin":
      return updateFeedById((feed:Feed)=>({...feed, isPin: !feed.isPin}));;
    default:
      throw new Error();
  }
};

const store = initStore()
const FeedsPaneContainer = () => {
  const [state, dispatch] = useReducer(reducer, store);
  const { feeds: itemsProps, groups: groupProps } = mapStoreToProps(state);
  console.log(1);
  return (
    <FeedsPaneComponent
      items={itemsProps}
      groups={groupProps}
      dispatch={dispatch}
    />
  );
};

export default FeedsPaneContainer;
