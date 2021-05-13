import { default as axios } from "axios";
import { auth } from "./auth";
import { inoreader } from "./inoreader";

export const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3777';
export const INOREADER_BASE_URL = "https://www.inoreader.com";
export const CORS_PROXY_URL = "https://localhost:8080";

const fetch = axios.create({
  baseURL: BASE_URL,
  timeout: 30 * 60 * 60 * 1000,
});

// 请求拦截器
fetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "JWT " + token;
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
    const data = response.data;
    if (data.code === 400) {
      console.error(data.message);
      return Promise.reject({ message: response.data.message });
    }
    return data;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

const api = { auth, inoreader };

export { api as default, fetch };
