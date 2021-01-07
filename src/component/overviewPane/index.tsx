import React from "react";
import {
  GroupedList,
  IGroupRenderProps,
  IGroupHeaderProps,
} from "office-ui-fabric-react/lib/GroupedList";
import {
  CommandBarButton,
  IIconProps,
  IContextualMenuProps,
} from "office-ui-fabric-react";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/CommandBar";
import { SelectionMode } from "office-ui-fabric-react/lib/Selection";
import { createGroups } from "@fluentui/example-data";
import "./style.css";

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
const listItemClassName =
  "cursor-pointer items-center h-10 text-base flex hover:bg-gray-200 select-none";

const commandBarItems: ICommandBarItemProps[] = [
  {
    key: "newItem",
    text: "New",
    cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
    iconProps: { iconName: "Add" },
    subMenuProps: {
      items: [
        {
          key: "emailMessage",
          text: "Email message",
          iconProps: { iconName: "Mail" },
          ["data-automation-id"]: "newEmailButton", // optional
        },
        {
          key: "calendarEvent",
          text: "Calendar event",
          iconProps: { iconName: "Calendar" },
        },
      ],
    },
  },
  {
    key: "upload",
    text: "Upload",
    iconProps: { iconName: "Upload" },
    href: "https://developer.microsoft.com/en-us/fluentui",
  },
  {
    key: "share",
    text: "Share",
    iconProps: { iconName: "Share" },
    onClick: () => console.log("Share"),
  },
  {
    key: "download",
    text: "Download",
    iconProps: { iconName: "Download" },
    onClick: () => console.log("Download"),
  },
];

const moreIcon: IIconProps = { iconName: "More" };

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: "emailMessage",
      text: "rename",
      iconProps: { iconName: "Edit" },
    },
    {
      key: "calendarEvent",
      text: "Calendar event",
      iconProps: { iconName: "Calendar" },
    },
  ],
};

const OverviewPane = ({ className }: Props) => {
  const onRenderCell = (
    nestingDepth?: number,
    item?: any,
    itemIndex?: number
  ): React.ReactNode => {
    return item && typeof itemIndex === "number" && itemIndex > -1 ? (
      <div
        className={`${listItemClassName}`}
        style={{ paddingLeft: `${2 * (nestingDepth || 1)}rem` }}
      >
        <FontIcon className="mr-2" iconName="Dictionary" />
        {item.title}
      </div>
    ) : null;
  };

  const groupProps: IGroupRenderProps = {
    onRenderHeader: (props?: IGroupHeaderProps): JSX.Element | null => {
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
          <div
            className={`${listItemClassName} pl-2`}
          >
            <FontIcon
              className={`mr-2 transition-all transform ${
                props.group!.isCollapsed ? "" : "rotate-90"
              }`}
              iconName="ChevronRight"
              onClick={toggleCollapse}
            />
            <span className="flex-1" onClick={toggleCollapse}>
              {props.group!.name} ({unreadCount})
            </span>
            <CommandBarButton
              className="mr-4 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus:outline-none"
              menuProps={menuProps}
              iconProps={moreIcon}
              onRenderMenuIcon={()=>null}
            />
          </div>
        );
      } else {
        return null;
      }
    },
  };

  return (
    <div className={`${className} flex flex-col`}>
      <GroupedList
        className="flex-1"
        items={items}
        onRenderCell={onRenderCell}
        groupProps={groupProps}
        selectionMode={SelectionMode.none}
        groups={groups}
      />
    </div>
  );
};

export default OverviewPane;
