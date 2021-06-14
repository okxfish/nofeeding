import Mock from "mockjs";
import { IdValuePair } from "../api/inoreader";
import MockAdapter from "axios-mock-adapter";
import { Sortable } from "../page/feed/overviewPane";

const Random = Mock.Random;

const USER_ID = "1006201176";

export interface Label {
  id: string;
  label: string;
}

export interface Tag extends Sortable {
  id: string;
  type?: string;
  unread_count?: number;
  unseen_count?: number;
}

export interface Subscription extends Sortable {
  categories: Label[];
  feedType: string;
  htmlUrl: string;
  iconUrl: string;
  id: string;
  title: string;
  url: string;
}

export interface Feed {
  id: string;
  published: number;
  origin: {
    htmlUrl: string;
    streamId: string;
    title: string;
  };
  summary: {
    content: string;
    direction: string;
  };
  canonical: { href: string }[];
  title: string;
  alternate: { href: string; type: string }[];
  annotations: any[];
  author: string;
  categories: string[];
  comments: any[];
  commentsNum: number;
  crawlTimeMsec: string;
  likingUsers: any[];
  timestampUsec: string;
  updated: number;
}

const createSubscription = (
  id: string,
  sortid: string,
  type: string,
  { url, iconUrl, title }
): Subscription => {
  return {
    categories: [{ id: "user/1006201176/label/独立博客", label: "独立博客" }],
    feedType: type,
    htmlUrl: url,
    iconUrl,
    id,
    sortid: sortid,
    title: title,
    url: url,
  };
};

const createIdValuePair = (id: string, value: string): IdValuePair => ({
  id,
  value,
});

const createStreampref = (sortids: string, isRoot?: boolean): IdValuePair[] => {
  let result: IdValuePair[] = [];

  if (!isRoot) {
    result.push(createIdValuePair("is-expanded", "true"));
  }
  result.push(createIdValuePair("subscription-ordering", sortids));
  return result;
};

const generateStreamId = (url: string): string => `feed/${url}`;

const isVaildStreamId = (id: string): boolean => id.startsWith("feed/");

const generateTagId = (userId: string, name: string): string =>
  `user/${userId}/label/${name}`;

const isVaildTagId = (id: string): boolean =>
  /user\/\d{6,10}\/label\/.*/.test(id);

const generateSystemTagId = (userId: string, name: string): string =>
  `user/${userId}/state/com.google/${name}`;

const isVaildSystemTagId = (id: string): boolean =>
  /user\/\d{6,10}\/state\/com.google\/.*/.test(id);

const generateFeedId = (id): string => `tag:google.com,2005:reader/item/${id}`;

const createTag = (
  id,
  sortid,
  type = "folder",
  { unreadCount, unseenCount } = { unreadCount: 0, unseenCount: 0 }
): Tag => {
  return {
    id,
    sortid,
    type,
    unread_count: unreadCount,
    unseen_count: unseenCount,
  };
};

const _getTags = (number: number): Tag[] => {
  let result: Tag[] = [];
  for (let index = 0; index < number; index++) {
    const title = Random.word();
    const idSeed = Random.id();
    const sortId = idSeed.slice(idSeed.length - 8, idSeed.length);
    const tagId = generateTagId(USER_ID, title);
    const type = Random.pick(["folder", "tag"]);
    result.push(createTag(tagId, sortId, type));
  }
  return result;
};

const _getSubscriptions = (number: number): Subscription[] => {
  let result: Subscription[] = [];
  for (let index = 0; index < number; index++) {
    const Random = Mock.Random;
    const title = Random.word();
    const id = Random.id();
    const url = `https://www.${title}.com/feed`;
    const sortId = id.slice(id.length - 8, id.length);
    const streamId = generateStreamId(url);
    const type = Random.pick(["folder, tag"]);
    result.push(
      createSubscription(streamId, sortId, type, {
        url,
        iconUrl: "",
        title: title,
      })
    );
  }

  return result;
};

const createFeed = (): Feed => {
  const randomId = Random.id().slice(0, 16);
  return {
    alternate: [
      { href: "https://t.bilibili.com/534520310768667380", type: "text/html" },
    ],
    annotations: [],
    author: Random.name(),
    canonical: [{ href: "https://t.bilibili.com/534520310768667380" }],
    categories: [
      "user/1006201176/state/com.google/reading-list",
      "user/1006201176/state/com.google/fresh",
    ],
    comments: [],
    commentsNum: -1,
    crawlTimeMsec: "1623293901497",
    id: generateFeedId(randomId),
    likingUsers: [],
    origin: {
      htmlUrl: "https://space.bilibili.com/15982391/dynamic",
      streamId:
        "feed/http://47.115.60.250:1200/bilibili/user/dynamic/15982391?filter=%E5%81%A5%E5%BA%B7%E6%97%A5%E5%8E%86",
      title: Random.title(1, 3),
    },
    published: 1623291108,
    summary: {
      content: Random.paragraph(),
      direction: "ltr",
    },
    timestampUsec: "1623293901496534",
    title: Random.title(1, 6),
    updated: 0,
  };
};

const _getFeeds = (number: number) => {
  let result: any[] = [];
  for (let index = 0; index < number; index++) {
    result.push(createFeed());
  }
  return result;
};

const tags = _getTags(10);
const rootTagId = generateSystemTagId(USER_ID, "root");
const streamprefs = {};
streamprefs[rootTagId] = createStreampref("", true);
const subscriptions = _getSubscriptions(10);

for (let index = 0; index < tags.length; index++) {
  const tag = tags[index];
  const subscription = subscriptions[index];
  const streampref = createStreampref(subscription.sortid);
  streamprefs[rootTagId][0].value += tag.sortid;
  streamprefs[tag.id] = streampref;
}

const generatePagesFeed = (count:number, pageSize: number) => {
  const result = {};
  for (let index = 0; index < count; index++) {
    const next = (index === count - 1) ? '' : (index + 1); 
    result[String(index)] = {
      continuation: String(next),
      items: _getFeeds(pageSize)
    }
  }
  return result;
}

const pagesFeed = generatePagesFeed(1, 100);

export const mockSetup = (axios) => {
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  mock.onGet(/^.*user-info$/).reply(200, {
    isBloggerUser: false,
    isMultiLoginEnabled: false,
    signupTimeSec: 1516257049,
    userEmail: "1119548217@qq.com",
    userId: USER_ID,
    userName: "1119548217",
    userProfileId: USER_ID,
  });

  mock.onGet(/^.*subscription\/list/).reply(200, {
    subscriptions: subscriptions,
  });

  mock.onGet(/^.*tag\/list/).reply(200, {
    tags: tags,
  });

  mock.onGet(/^.*stream\/contents/).reply((config) => {
    console.log('pagesFeed', pagesFeed);
    return [
      200,
      pagesFeed[config.params.c || 0],
    ];
  });

  mock.onGet(/^.*preference\/stream\/list/).reply(200, {
    streamprefs: streamprefs,
  });

  mock.onPost(/^.*edit-tag/).reply(200, "ok");

  return mock;
};
