import React from "react";
import { FeedItem } from "../page/feed/types";

export const ArticleContext = React.createContext<FeedItem | null>(null);
export const FeedContext = React.createContext<any>(null);
export const SetFeedItemContext = React.createContext<any>(null);
