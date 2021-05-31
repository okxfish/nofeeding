import { default as axios } from "axios";
import { auth } from "./auth";
import { inoreader } from "./inoreader";

export const INOREADER_AUTH_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3777/"
    : "https://helloo.world/";
export const INOREADER_SERVER_URL = "https://www.innoreader.com";
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

export { api as default, fetch };
