import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParam } from "../../utils/useSearchParma";

const Oauth = ({ location }) => {
  const code = useSearchParam("code");

  useEffect(() => {
    const getAutoToken = async () => {
      const {
        data: {
          data: { token },
        },
      } = await axios.get(
        `http://localhost:3777/api/rss?code=${code}&redirect_uri=${window.location.origin}${window.location.pathname}`
        );
        localStorage.setItem('inoreaderToken', token);
        window.close();
    };
    getAutoToken();
  }, [code]);

  return null;
};

export default Oauth;
