import { default as React, Dispatch } from "react";
import {
  Text,
  Image,
  ImageFit,
  IconButton,
  IIconProps,
  IContextualMenuProps,
  FontIcon,
  IGroup,
  IImageProps,
  GroupedList,
  IGroupRenderProps,
  IGroupHeaderProps,
} from "office-ui-fabric-react";
import { FeedProps } from "./types";

export interface Props {
  className?: string;
}

export interface Props {
  className?: string;
  items: FeedProps[];
  groups: IGroup[];
  dispatch: Dispatch<any>;
}

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

const FeedsPane = ({ className, items, groups, dispatch }: Props) => {
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

    const updateFieldInItem = (field: string): void => {
      if (!item || typeof item === "undefined") {
        return;
      } else {
      }
    };

    const handleMarkAsReadClick = (field: string): void => {
      updateFieldInItem(field);
    };

    const toggleIsReadById = (id: string): void =>
      dispatch({ type: "feed/ById/toggleIsRead", payload: id });
    const toggleIsStarById = (id: string): void =>
      dispatch({ type: "feed/ById/toggleIsStar", payload: id });
    const toggleIsPinById = (id: string): void =>
      dispatch({ type: "feed/ById/toggleIsPin", payload: id });

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
              onClick={toggleIsPinById.bind(null, item.key)}
            />
            <IconButton
              className="focus:outline-none"
              iconProps={item.isStar ? favoriteStarFillIcon : favoriteStarIcon}
              title="favorite"
              ariaLabel="Favorite"
              disabled={false}
              onClick={toggleIsStarById.bind(null, item.key)}
            />
            <IconButton
              className="focus:outline-none"
              iconProps={item.isRead ? readingModeSolidIcon : readingModeIcon}
              title="mark as read"
              ariaLabel="Mark as read"
              disabled={false}
              onClick={toggleIsReadById.bind(null, item.key)}
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
        <div className="cursor-pointer text-gray-600 text-lg font-bold leading-loose border-b border-gray-600 mb-4">
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
