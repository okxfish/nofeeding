import { fetch, INOREADER_AUTH_URL } from './index';

const getInoreaderAuthURI = () => fetch.get(`/inoreader/authURI`, {headers: {baseURL: INOREADER_AUTH_URL}});

const getInoreaderAccessToken = (code:string) => fetch.get(`/inoreader/token?code=${code}`, {headers: {baseURL: INOREADER_AUTH_URL}});

export const auth =  {
  getInoreaderAuthURI,
  getInoreaderAccessToken
};