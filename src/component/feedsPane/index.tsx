import { default as React, useState } from "react";
import {
  Text,
  Image,
  ImageFit,
  IconButton,
  IIconProps,
  IContextualMenuProps,
  FontIcon,
  IImageProps,
  GroupedList,
  IGroupRenderProps,
  IGroupHeaderProps,
} from "office-ui-fabric-react";
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
  isPin?: boolean;
}

interface FeedGroupProps {
  key: string;
  id: string;
  children: FeedGroupProps[];
  count: number;
  isCollapsed?: boolean;
  level: number;
  name: string;
  startIndex: number;
}

const fullSummary: string =
  "this is rss summary at next but not last, you need to do a lot of things to make the world in better place. as people say, time is gold, nobody can reject the air.";

interface GroupData {
  key: string;
  index: string;
  name: string;
  children: FeedProps[];
}

const createItems = (count: number): FeedProps[] => {
  return Array.from({
    length: count,
  }).map((item: any, index: number): any => {
    const rdBase: number = 100;
    const rdNumber: number = Math.floor(Math.random() * rdBase);
    const rdBool: boolean = rdNumber / rdBase > 0.5;
    return {
      key: rdNumber,
      id: rdNumber,
      title: `this is rss source: ${rdNumber}`,
      summary: fullSummary.slice(rdNumber),
      sourceName: "some news",
      time: "3 days",
      isRead: rdBool,
      isStar: rdBool,
      isPin: rdBool,
    };
  });
};

const createGroupsData = (count: number): GroupData[] => {
  return Array.from({
    length: count,
  }).map((item: any, index: number): any => {
    return {
      key: index,
      id: index,
      name: `group (${index})`,
      children: createItems(3),
    };
  });
};

const groupData: GroupData[] = createGroupsData(3);

const transItemsProps = (data: GroupData[]): FeedProps[] => {
  return data
    .map((item: GroupData, index: number) =>
      item.children.map((feed) => ({ ...feed, groupIndex: index }))
    )
    .flat();
};

const transGroupProps = (data: GroupData[]): FeedGroupProps[] => {
  return data.reduce(
    (
      previousValue: FeedGroupProps[],
      currentValue: GroupData,
      currentIndex: number
    ): FeedGroupProps[] => {
      const rdBase: number = 100;
      const rdNumber: number = Math.floor(Math.random() * rdBase);
      const group = {
        key: String(rdNumber),
        id: String(rdNumber),
        count: currentValue.children.length,
        isCollapsed: false,
        level: 0,
        name: `Group ${rdNumber}`,
        children: [],
        startIndex: 0,
      };
      previousValue.push(group);
      return previousValue;
    },
    []
  );
};

export interface Props {
  className?: string;
}

const FeedsPane = ({ className }: Props) => {
  const [data, setData] = useState<any>(groupData);
  const items = transItemsProps(data);
  const groups = transGroupProps(data);

  const onRenderCell = (
    nestingDepth?: number,
    item?: FeedProps,
    itemIndex?: number
  ): React.ReactNode => {
    const imageProps: IImageProps = {
      src: "http://placehold.it/100x75",
      width: 100,
      height: 100,
      imageFit: ImageFit.cover,
    };

    const moreIcon: IIconProps = { iconName: "More" };
    const favoriteStarIcon: IIconProps = { iconName: "FavoriteStar" };
    const favoriteStarFillIcon: IIconProps = { iconName: "FavoriteStarFill" };
    const pinSolid12Icon: IIconProps = { iconName: "PinSolid12" };
    const pinSolidOff12Icon: IIconProps = { iconName: "PinSolidOff12" };
    const readingModeIcon: IIconProps = { iconName: "ReadingMode" };
    const readingModeSolidIcon: IIconProps = { iconName: "ReadingModeSolid" };
    const menuProps: IContextualMenuProps = {
      items: [
        {
          key: "emailMessage",
          text: "Email message",
          iconProps: { iconName: "Mail" },
        },
        {
          key: "calendarEvent",
          text: "Calendar event",
          iconProps: { iconName: "Calendar" },
        },
      ],
      directionalHintFixed: true,
    };

    const updateFieldInItem = (field: string): void => {
      if (!item || typeof item.groupIndex === "undefined") {
        return;
      } else {
        const newData: GroupData[] = [
          ...items.slice(0, itemIndex),
          {
            ...item,
            [field]: !item[field],
          },
          ...items.slice(itemIndex + 1),
        ];
        setData(newData);
      }
    };

    const handleMarkAsReadClick = (field: string): void => {
      updateFieldInItem(field);
    };

    return item && typeof itemIndex === "number" && itemIndex > -1 ? (
      <div className="flex border-b border-gray-300 mb-4 pb-4 cursor-pointer group">
        <Image className="flex-shrink-0 mr-3" {...imageProps} />
        <div className="flex-1">
          <div className="relative flex items-start mb-2 text-lg text-gray-800 leading-none font-medium">
            <span className="flex-1">{item.title}</span>
          </div>
          <div className="text-base text-gray-600">{item.summary}</div>
          <div className="flex items-center justify-end w-full">
            <div className="flex-1 text-sm text-gray-400">
              <span className="pr-1">{item.sourceName}</span>
              <span>/</span>
              <span className="pl-1">{item.time}</span>
            </div>
            <IconButton
              className="focus:outline-none"
              iconProps={item.isPin ? pinSolid12Icon : pinSolidOff12Icon}
              title="pin as unread"
              ariaLabel="Pin as unread"
              disabled={false}
              onClick={handleMarkAsReadClick.bind(null, "isPin")}
            />
            <IconButton
              className="focus:outline-none"
              iconProps={item.isStar ? favoriteStarFillIcon : favoriteStarIcon}
              title="favorite"
              ariaLabel="Favorite"
              disabled={false}
              onClick={handleMarkAsReadClick.bind(null, "isStar")}
            />
            <IconButton
              className="focus:outline-none"
              iconProps={item.isRead ? readingModeSolidIcon : readingModeIcon}
              title="mark as read"
              ariaLabel="Mark as read"
              disabled={false}
              onClick={handleMarkAsReadClick.bind(null, "isRead")}
            />
            <IconButton
              className="focus:outline-none"
              menuProps={menuProps}
              iconProps={moreIcon}
              onRenderMenuIcon={() => null}
              title="more"
              ariaLabel="More"
              disabled={false}
              checked={false}
            />
          </div>
        </div>
      </div>
    ) : null;
  };

  const onRenderHeader = (props?: IGroupHeaderProps): JSX.Element | null => {
    if (props && props.group) {
      return (
        <div
          className="cursor-pointer text-gray-600 text-lg font-bold leading-loose border-b border-gray-600 mb-4"
          // onClick={toggleCollapse}
        >
          {props.group!.name}
        </div>
      );
    } else {
      return null;
    }
  };

  const groupProps: IGroupRenderProps = {
    onRenderHeader: onRenderHeader,
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
