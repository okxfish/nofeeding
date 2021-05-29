import React from "react";
import { FeedItem } from "../page/feed/types";

export const ArticleContext = React.createContext<FeedItem | null>(null);
