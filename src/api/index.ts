import { default as axios } from "axios";
import { auth } from "./auth";
import { inoreader } from "./inoreader";
import MockAdapter from "axios-mock-adapter";
import { getStreamprefs, getSubscriptions, getTags, getFeeds } from './mockData';

const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

mock.onGet(/^.*user-info$/).reply(200, {
  isBloggerUser: false,
  isMultiLoginEnabled: false,
  signupTimeSec: 1516257049,
  userEmail: "1119548217@qq.com",
  userId: "1006201176",
  userName: "1119548217",
  userProfileId: "1006201176",
});

mock.onGet(/^.*subscription\/list/).reply(200, {
  subscriptions: getSubscriptions()
});

mock.onGet(/^.*tag\/list/).reply(200, {
  tags: getTags()
});

mock.onGet(/^.*stream\/contents/).reply(200, {
  items: getFeeds()
});

mock.onGet(/^.*preference\/stream\/list/).reply(200, {
  streamprefs: getStreamprefs()
});

mock.onPost(/^.*edit-tag/).reply(200, 'ok');

export const INOREADER_AUTH_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3777/"
    : "https://helloo.world/";
export const INOREADER_SERVER_URL = "www.innoreader.com";
export const CORS_PROXY_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://helloo.world/cors";

const fetch = axios.create({
  baseURL: `${CORS_PROXY_URL}/${INOREADER_SERVER_URL}`,
  timeout: 60 * 60 * 1000,
});

// 请求拦截器
fetch.interceptors.request.use(
  (config) => {
    const inoreaderToken = localStorage.getItem("inoreaderToken") || "";
    if (inoreaderToken) {
      config.headers.Authorization = `Bearer ${inoreaderToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
fetch.interceptors.response.use(
  (response) => {
    const { status, statusText } = response;
    if ((status >= 200 && status < 300) || status === 304) {
      return response;
    } else {
      return Promise.reject({ message: `${status}: ${statusText}` });
    }
  },
  (error) => {
    if (
      error.response.status === 401 ||
      error.response.data ===
        "AppId required! Contact app developer. See https://inoreader.dev"
    ) {
      localStorage.removeItem("inoreaderToken");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const api = { auth, inoreader };

// Mock.mock('http://localhost:8080/www.innoreader.com/reader/api/0/user-info', "GET", () => {
//   debugger
//   console.log('Mock.mock(/^.*user-info$/, "GET"');
//   return createResponse({
//     isBloggerUser: false,
//     isMultiLoginEnabled: false,
//     signupTimeSec: 1516257049,
//     userEmail: "1119548217@qq.com",
//     userId: "fuckyou",
//     userName: "1119548217",
//     userProfileId: "1006201176",
//   });
// });

export { api as default, fetch };
