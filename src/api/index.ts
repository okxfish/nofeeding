import { default as axios } from "axios";
import { auth } from "./auth";
import { inoreader } from "./inoreader";
import { mockSetup } from "./mockData";

interface ServerConfig {
  inoreaderAuthUrl: string;
  inoreaderServerUrl: string;
  corsProxyUrl: string;
}

const devConfig: ServerConfig = {
  inoreaderAuthUrl: "http://localhost:3777/",
  inoreaderServerUrl: "www.innoreader.com",
  corsProxyUrl: "http://localhost:8080",
};

const prdConfig: ServerConfig = {
  inoreaderAuthUrl: "https://helloo.world/",
  inoreaderServerUrl: "www.innoreader.com",
  corsProxyUrl: "https://helloo.world/cors",
};

let serverConfig: ServerConfig = prdConfig;

// if (process.env.NODE_ENV === "development") {
//   serverConfig = devConfig;
//   mockSetup(axios);
// }

export const INOREADER_AUTH_URL = serverConfig.inoreaderAuthUrl;

const fetch = axios.create({
  baseURL: `${serverConfig.corsProxyUrl}/${serverConfig.inoreaderServerUrl}`,
  timeout: 60 * 60 * 1000,
});

// 请求拦截器
fetch.interceptors.request.use(
  (config) => {
    const inoreaderToken = localStorage.getItem("inoreaderToken") || "9cb54225d90c42df30f97de246a90933d87277f7";
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
