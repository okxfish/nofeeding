import React from "react";
import {
  GroupedList,
  IGroupRenderProps,
  IGroupHeaderProps,
  CommandBarButton,
  IIconProps,
  FontIcon,
  SelectionMode,
  IContextualMenuProps,
} from "office-ui-fabric-react";
import { createGroups } from "@fluentui/example-data";
import OverviewCell from "./overviewCell";
import "./style.css";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";

export interface Props {
  className?: string;
}

const groupCount = 5;
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
  "cursor-pointer items-center h-10 text-base flex hover:bg-gray-50 select-none";

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
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const location = useLocation();
  const commonPx = "px-2";

  const onRenderCell = (
    nestingDepth?: number,
    item?: any,
    itemIndex?: number
  ): React.ReactNode => {
    const onClick = () => history.push(`/feed/source?sourceName=${item.title}`);
    return item && typeof itemIndex === "number" && itemIndex > -1 ? (
      <div
        className={`${listItemClassName} hover:bg-gray-200 rounded-sm`}
        style={{ paddingLeft: `${2 * (nestingDepth || 1)}rem` }}
        onClick={onClick}
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
          <div className={`${listItemClassName} ${commonPx} hover:bg-gray-200 rounded-sm`}>
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
              className="bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none min-w-0"
              menuProps={menuProps}
              iconProps={moreIcon}
              onRenderMenuIcon={() => null}
            />
          </div>
        );
      } else {
        return null;
      }
    },
  };

  return (
    <div className={`${className} flex-1 flex flex-col min-h-0 cursor-pointer`}>
      <OverviewCell
        className={`${commonPx}`}
        iconProps={{ iconName: "PreviewLink" }}
        content="all"
        onClick={()=>history.push('/feed/all')}
      />
      <OverviewCell
        className={`${commonPx}`}
        iconProps={{ iconName: "FavoriteStar" }}
        content="star"
        onClick={()=>history.push('/feed/star')}
      />
      <OverviewCell
        className={`${commonPx}`}
        iconProps={{ iconName: "Archive" }}
        content="archive"
        onClick={()=>history.push('/feed/archive')}
      />
      <OverviewCell
        className={`${commonPx} bg-gray-50 rounded-t-lg rounded-b-none sm:bg-transparent sm:rounded-b-sm sm:rounded-t-sm`}
        iconProps={{ iconName: "Source" }}
        content="source"
        onFooterRender={() => (
          <CommandBarButton
            className="bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none min-w-0"
            menuProps={menuProps}
            iconProps={moreIcon}
            onRenderMenuIcon={() => null}
          />
        )}
      />
      <GroupedList
        className="flex-1 border-b border-t overflow-y-auto scrollbar-none bg-gray-50 sm:bg-transparent"
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
