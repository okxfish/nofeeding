import React from "react";
import "./style.css";

export interface Props {
  id: string;
  title: string;
  content: string;
  time: string;
  source: string;
  categroy: string;
  isRead: boolean;
  isStar: boolean;
  isLocked: boolean;
  onRead?(): void;
  onStar?(): void;
  onLock?(): void;
  onMore?(): void;
}

const FeedItem = ({
  id='',
  title='',
  content='',
  time='',
  source='',
  categroy='',
  isRead=false,
  isStar=false,
  isLocked=false,
  onRead=()=>{},
  onStar=()=>{},
  onLock=()=>{},
  onMore=()=>{},
}: Props) => {
  return (
    <div className="mb-4">
      <div className="mb-1 text-lg text-gray-800 font-bold">{title}</div>
      <div className="mb-1 text-gray-500 text-xs">
        <span>{source}</span>
        <span>{time}</span>
        <span>{categroy}</span>
      </div>
      <div className="mb-1 content h-16 overflow-y-hidden text-sm text-gray-600 break-words">
        {content}
      </div>
      <div className="flex justify-between">
        <button onClick={onRead}>
          <span>⚪</span>
          <span>read</span>
        </button>
        <button onClick={onStar}>
          <span>⭐</span>
          <span>star</span>
        </button>
        <button onClick={onLock}>
          <span>🔒</span>
          <span>lock</span>
        </button>
        <button onClick={onMore}>
          <span>⬜</span>
          <span>more</span>
        </button>
      </div>
    </div>
  );
};

export default FeedItem;
