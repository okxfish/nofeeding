import React from "react";
import {
  GroupedList,
  IGroupRenderProps,
  IGroupHeaderProps,
} from "office-ui-fabric-react/lib/GroupedList";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";
import { SelectionMode } from "office-ui-fabric-react/lib/Selection";
import { createListItems, createGroups } from "@fluentui/example-data";

export interface Props {
  className?: string;
}

const groupCount = 3;
const groupDepth = 1;
const createItems = (count: number): any[] => {
  return Array.from({
    length: count,
  }).map((item: any, index: number): any => ({
    key: index,
    unreadCount: 2,
    title: `this is rss source: ${index}`,
  }));
};

const items: any[] = createItems(Math.pow(groupCount, groupDepth + 1));

const groups = createGroups(groupCount, groupDepth, 0, groupCount);

const OverviewPane = ({ className }: Props) => {
  const onRenderCell = (
    nestingDepth?: number,
    item?: any,
    itemIndex?: number
  ): React.ReactNode => {
    return item && typeof itemIndex === "number" && itemIndex > -1 ? (
      <div
        className="cursor-pointer"
        style={{ marginLeft: `${12 * (nestingDepth || 1)}px` }}
      >
        {item.title}
      </div>
    ) : null;
  };

  const groupProps: IGroupRenderProps = {
    onRenderHeader: (props?: IGroupHeaderProps): JSX.Element | null => {
      console.log(props);
      if (props && props.group) {
        const toggleCollapse = (): void => {
          props.onToggleCollapse!(props.group!);
        };

        let unreadCount: number = 0;
        const children = items.slice(
          props.group.startIndex,
          props.group.startIndex + props.group.count
        );
        children.forEach((item) => {
          unreadCount += item.unreadCount;
        });
        return (
          <div className="cursor-pointer" onClick={toggleCollapse}>
            {props.group!.name} ({unreadCount})
          </div>
        );
      } else {
        return null;
      }
    },
  };

  return (
    <GroupedList
      items={items}
      onRenderCell={onRenderCell}
      groupProps={groupProps}
      selectionMode={SelectionMode.none}
      groups={groups}
    />
  );
};

export default OverviewPane;
