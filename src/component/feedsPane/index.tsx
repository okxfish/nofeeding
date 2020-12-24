import * as React from "react";
import {
  GroupedList,
  IGroupRenderProps,
  IGroupHeaderProps,
} from "office-ui-fabric-react/lib/GroupedList";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";
import { createGroups } from "@fluentui/example-data";

export interface Props {
  className?: string;
}

const groupCount = 3;
const groupDepth = 1;

interface Tag {
  id: string;
  name: string;
}

interface Source {
  id: string;
  name: string;
  iconSrc?: string;
  url?: string;
}

interface SourceGroup {
  id: string;
  name: string;
}

interface Feed {
  id: string;
  title: string;
  summary: string;
  thumbnailSrc: string;
  sourceName: Source["name"];
  sourceID: Source["id"];
  time: string;
  tags: Tag["name"];
  isRead: string;
  isStar: string;
}

interface FeedProps {
  key: string;
  id: string;
  title: string;
  summary?: string;
  sourceName: string;
  time?: string;
  isRead?: boolean;
  isStar?: boolean;
}

const fullSummary: string =
  "this is rss summary at next but not last, you need to do a lot of things to make the world in better place. as people say, time is gold, nobody can reject the air.";

const createItems = (count: number): FeedProps[] => {
  return Array.from({
    length: count,
  }).map((item: any, index: number): any => {
    const rdBase: number = 100;
    const rdNumber: number = Math.floor(Math.random() * rdBase);
    const rdBool: boolean = rdNumber / rdBase > 0.5;
    return {
      key: index,
      id: index,
      title: `this is rss source: ${index}`,
      summary: fullSummary.slice(rdNumber),
      sourceName: "some news",
      time: "3 days",
      isRead: rdBool,
      isStar: rdBool,
    };
  });
};

const items: FeedProps[] = createItems(Math.pow(groupCount, groupDepth + 1));

const groups = createGroups(groupCount, groupDepth, 0, groupCount);
export interface Props {
  className?: string;
}

const FeedsPane = ({ className }: Props) => {
  const onRenderCell = (
    nestingDepth?: number,
    item?: FeedProps,
    itemIndex?: number
  ): React.ReactNode => {
    return item && typeof itemIndex === "number" && itemIndex > -1 ? (
      <div className="cursor-pointer border-b border-gray-300 mb-4 pb-4">
        <div className="text-lg text-gray-800 font-medium">{item.title}</div>
        <div className="text-base text-gray-600 break-all">{item.summary}</div>
      </div>
    ) : null;
  };

  const groupProps: IGroupRenderProps = {
    onRenderHeader: (props?: IGroupHeaderProps): JSX.Element | null => {
      if (props && props.group) {
        const toggleCollapse = (): void => {
          props.onToggleCollapse!(props.group!);
        };
        return (
          <div
            className="cursor-pointer text-gray-600 text-lg font-bold leading-loose border-b border-gray-600 mb-4"
            onClick={toggleCollapse}
          >
            {props.group!.name}
          </div>
        );
      } else {
        return null;
      }
    },
  };

  return (
    <GroupedList
      className="mx-6"
      items={items}
      onRenderCell={onRenderCell}
      groupProps={groupProps}
      groups={groups}
    />
  );
};

export default FeedsPane;
