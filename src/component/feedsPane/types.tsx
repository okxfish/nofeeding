export interface ObejectWithId {
  id: string;
}

export interface Feed extends ObejectWithId {
  title: string;
  summary: string;
  thumbnailSrc?: string;
  sourceName: string;
  sourceID: string;
  time: string;
  tags?: string;
  isRead: boolean;
  isStar: boolean;
  isPin: boolean;
}

export interface FeedGroup extends ObejectWithId {
  name: string;
  children: any[];
}

export interface FeedProps {
  key: string;
  id: string;
  groupIndex: number;
  title: string;
  summary?: string;
  thumbnailSrc?: string;
  className?: string;
  sourceName?: string;
  time?: string;
  isRead?: boolean;
  isStar?: boolean;
  isInnerArticleShow?: boolean;
  closeInnerArticle(e: any): void;
  onStarClick(e: any): void;
  onReadClick(e: any): void;
}

export interface ById<T> {
  [id: string]: T;
}

export interface DataInStore<T> {
  byId: {
    [id: string]: T;
  };
  allId: string[];
}
