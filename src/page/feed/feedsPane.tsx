import {
  default as React,
  useContext,
  useMemo,
} from "react";
import { FeedContext } from "../../context/feed";
import { IGroup } from "@fluentui/react";
import { FeedItem } from "./types";
import { groupBy } from "lodash";
import dayjs from "dayjs";
import FeedPaneComponent from "./feedPaneComponent";
export interface Props {
  className?: string;
  getScrollParent(): any;
}

const FeedsPane = ({ className, getScrollParent }: Props) => {
  const { streamContentQuery, streamContentData } =
    useContext(FeedContext);

  const groups = useMemo<IGroup[]>((): IGroup[] => {
    const streamContents: FeedItem[] = streamContentData;

    const comparePublishDate = (a, b): number => {
      const dayA = dayjs(a);
      const dayB = dayjs(b);
      return dayB.diff(dayA);
    };

    const streamContentsGrouped = groupBy(streamContents, (article) => {
      return dayjs(dayjs(article.publishedTime).format("YYYY-MM-DD")).toNow();
    });

    const keys = Object.keys(streamContentsGrouped);
    const keysOrderByPublishDate = keys.sort(comparePublishDate);
    let groupStartIndex = 0;
    const result: IGroup[] = keysOrderByPublishDate.reduce<IGroup[]>(
      (acc, cur) => {
        const groupElements = streamContentsGrouped[cur];
        const group = {
          key: cur,
          name: cur,
          startIndex: groupStartIndex,
          count: groupElements.length,
          isCollapsed: false,
        };
        groupStartIndex += groupElements.length;
        acc.push(group);
        return acc;
      },
      []
    );
    return result;
  }, [streamContentData]);

  return (
    <FeedPaneComponent
      className={className}
      items={streamContentData}
      groups={groups}
      hasNextPage={streamContentQuery.hasNextPage}
      isFetching={streamContentQuery.isFetching}
      fetchNextPage={streamContentQuery.fetchNextPage}
      getScrollParent={getScrollParent}
    />
  );
};

export default React.memo(FeedsPane);
