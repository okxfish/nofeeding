import Mock from "mockjs";
import { IdValuePair } from "../api/inoreader";
import MockAdapter from "axios-mock-adapter";
import { Sortable } from "../page/feed/overviewPane";
import { sample } from "lodash";

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
        categories: [
            { id: "user/1006201176/label/独立博客", label: "独立博客" },
        ],
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
        const title = Random.ctitle();
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
        const title = Random.ctitle();
        const id = Random.id();
        const url = `https://www.${title}.com/feed`;
        const sortId = id.slice(id.length - 8, id.length);
        const streamId = generateStreamId(url);
        const type = Random.pick(["folder, tag"]);
        result.push(
            createSubscription(streamId, sortId, type, {
                url,
                iconUrl: Random.image("24x24"),
                title: title,
            })
        );
    }

    return result;
};

const subscriptions = _getSubscriptions(30);

const createFeed = (): Feed => {
    const randomId = Random.id().slice(0, 16);
    const subscription = sample(subscriptions);
    return {
        alternate: [
            {
                href: "https://t.bilibili.com/534520310768667380",
                type: "text/html",
            },
        ],
        annotations: [],
        author: Random.cname(),
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
            htmlUrl: subscription?.htmlUrl || '',
            streamId: subscription?.id || '',
            title: subscription?.title || '',
        },
        published: 1623291108,
        summary: {
            content: `
            <div>
            <img src="${Random.image("640x360")}" />
            <h1>${Random.ctitle(5, 8)}</h1>
            <h2>${Random.ctitle(5, 8)}</h2>
            <h3>${Random.ctitle(5, 8)}</h3>
            <h4>${Random.ctitle(5, 8)}</h4>
            <h5>${Random.ctitle(5, 8)}</h5>
            <p>${Random.cparagraph(12, 24)}<p/>
            <ul>
            <li>${Random.cname()}</li>
            <li>${Random.cname()}</li>
            <li>${Random.cname()}</li>
            <li>${Random.cname()}</li>
            </ul>
            <ol>
            <li>${Random.cname()}</li>
            <li>${Random.cname()}</li>
            <li>${Random.cname()}</li>
            <li>${Random.cname()}</li>
            </ol>
            <h3>${Random.ctitle(5, 8)}</h3>
            <p>${Random.cparagraph(16, 32)}<p/>
            <img src="${Random.image("640x480")}" />
            ${Random.cparagraph(12, 24)}
            <div>`,
            direction: "ltr",
        },
        timestampUsec: "1623293901496534",
        title: Random.ctitle(6, 48),
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

for (let index = 0; index < tags.length; index++) {
    const tag = tags[index];
    const streampref = createStreampref(
        subscriptions
            .slice(index * 3, index * 3 + 3)
            .map((subscription) => subscription.sortid)
            .join("")
    );
    streamprefs[rootTagId][0].value += tag.sortid;
    streamprefs[tag.id] = streampref;
}

const generatePagesFeed = (count: number, pageSize: number) => {
    const result = {};
    for (let index = 0; index < count; index++) {
        const next = index === count - 1 ? "" : index + 1;
        result[String(index)] = {
            continuation: String(next),
            items: _getFeeds(pageSize),
        };
    }
    return result;
};

const pagesFeed = generatePagesFeed(5, 20);

export const mockSetup = (axios) => {
    const mock = new MockAdapter(axios, {
        onNoMatch: "passthrough",
        delayResponse: 500,
    });

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
        return [200, pagesFeed[config.params.c || 0]];
    });

    mock.onGet(/^.*preference\/stream\/list/).reply(200, {
        streamprefs: streamprefs,
    });

    mock.onPost(/^.*edit-tag/).reply(200, "ok");

    return mock;
};
