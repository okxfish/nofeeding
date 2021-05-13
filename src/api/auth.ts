import { fetch } from './index';

const getInoreaderAuthURI = () => fetch.get(`/inoreader/authURI`);

const getInoreaderAccessToken = (code:string) => fetch.get(`/inoreader/token?code=${code}`);

export const auth =  {
  getInoreaderAuthURI,
  getInoreaderAccessToken
};