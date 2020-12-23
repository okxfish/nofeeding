import React from "react";
import FeedItem from "./../feedItem";
import { Props as FeedItemPropsType } from "../feedItem";

export interface Props {
  id: string;
  title: string;
  list: FeedItemPropsType[];
}

const Group = ({ id, title = "最近", list }: Props) => {
  return (
    <div className="mx-6 mb-8">
      <div className="sticky top-0 mb-2 py-2 border-b border-gray-400 font-bold text-2xl bg-gray-100">
        {title}
      </div>
      <div>
        {list.map((item, index) => (
          <FeedItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Group;
