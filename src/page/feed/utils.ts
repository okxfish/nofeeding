import { useEffect, useState } from "react";
import Parser from "rss-parser";

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const _RSS_SRC = "https://rsshub.app/readhub/category/daily";
const RSS_SRC = "http://feeds.feedburner.com/ruanyifeng";

const parser: Parser<any, any> = new Parser();

export const useFeedsData = () => {
  const [feedsData, setFeedsData] = useState([{ content: "", title: "" }]);

  useEffect(() => {
    (async () => {
      try {
        const feed = await parser.parseURL(CORS_PROXY + RSS_SRC);
        setFeedsData(feed.items);
        console.log(feed.items);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return feedsData;
};
