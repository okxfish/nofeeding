import {
  default as React,
  useContext,
} from "react";
import { FeedContext } from "../../context";
import FeedPaneComponent from "./feedPaneComponent";
export interface Props {
  className?: string;
  getScrollParent(): any;
}

const FeedsPane = ({ className, getScrollParent }: Props) => {
  const { streamContentQuery, streamContentData } =
    useContext(FeedContext);

  return (
    <FeedPaneComponent
      className={className}
      items={streamContentData}
      hasNextPage={streamContentQuery.hasNextPage}
      isFetching={streamContentQuery.isFetching}
      fetchNextPage={streamContentQuery.fetchNextPage}
      getScrollParent={getScrollParent}
    />
  );
};

export default React.memo(FeedsPane);
