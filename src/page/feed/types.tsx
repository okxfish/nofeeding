
import { Dayjs } from 'dayjs';
import { IButtonProps } from 'office-ui-fabric-react';
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
  starButtonProps?: IButtonProps;
  unreadMarkButtonProps?: IButtonProps;
}

export interface FeedGroup {
  id: string;
  name: string;
  children: any[];
}

export interface FeedProps extends FeedItem{
  className?: string;
  rootClassName?: string;
  itemClassName?: string;
  onClick?(item:FeedItem, index:number, e:any):void;
  onStar?(item:FeedItem, index:number, e:any):void;
  onRead?(item:FeedItem, index:number, e:any):void;
}