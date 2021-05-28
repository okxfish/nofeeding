
import { Dayjs } from 'dayjs';
export interface FeedItem {
  id: string;
  title: string;
  summary?: string;
  thumbnailSrc?: string;
  content?: string;
  url?: string;
  sourceName?: string;
  sourceID?: string;
  publishedTime: Dayjs;
  isRead?: boolean;
  isStar?: boolean;
  isInnerArticleShow?: boolean;
}

export interface FeedGroup {
  id: string;
  name: string;
  children: any[];
}

export interface FeedProps {
  className?: string;
  data: FeedItem;
  onClick?(item:FeedItem, index:number, e:any):void;
  onStar?(item:FeedItem, index:number, e:any):void;
  onRead?(item:FeedItem, index:number, e:any):void;
}