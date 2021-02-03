import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParam } from "../../utils/useSearchParma";

const Oauth = ({}) => {
  const code = useSearchParam("code");
  console.log(code);

  useEffect(() => {
    axios.get(`http://localhost:3888/oauth/inoreader/${code}`);
  }, [code]);

  return null;
};

export default Oauth;
