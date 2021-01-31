import {
  FeedGroup,
  Feed,
  DataInStore,
  ObejectWithId,
} from "../../component/feedsPane/types";
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
  const staticState: any = { isSidePaneOpen: false, currenActivedFeedId: '' };
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

export const initState  = initStore();

export const reducer = (state, action) => {
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
    case "feed/ById/markAsRead":
      return updateFeedById((feed: Feed) => ({
        ...feed,
        isRead: true,
      }));
    case "feed/ById/markAsUnread":
      return updateFeedById((feed: Feed) => ({
        ...feed,
        isRead: false,
      }));
    case "feed/ById/toggleIsStar":
      return updateFeedById((feed: Feed) => ({
        ...feed,
        isStar: !feed.isStar,
      }));
    case "feed/ById/changeCurrentActivedFeedId":
      return ({
        ...state,
        currenActivedFeedId: action.payload
      });
    case "feed/ById/showInnerArticle":
      return updateFeedById((feed: Feed) => ({
        ...feed,
        isInnerArticleShow: true,
      }));
    case "feed/ById/hideInnerArticle":
      return updateFeedById((feed: Feed) => ({
        ...feed,
        isInnerArticleShow: false,
      }));
    case "sidePane/open":
      return { ...state, isSidePaneOpen: true };
    default:
      throw new Error();
  }
};
