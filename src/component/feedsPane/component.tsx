import { default as React, Dispatch } from "react";
import {
  Text,
  Image,
  ImageFit,
  IconButton,
  IIconProps,
  Panel,
  PanelType,
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
  onClickFeed?(): any;
  items: FeedProps[];
  groups: IGroup[];
  isSidePaneOpen: boolean;
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

const FeedsPane = ({
  className,
  items,
  groups,
  onClickFeed,
  isSidePaneOpen,
  dispatch,
}: Props) => {
  const onRenderCell = (
    nestingDepth?: number,
    item?: FeedProps,
    itemIndex?: number
  ): React.ReactNode => {
    const imageProps: IImageProps = {
      src: item?.thumbnailSrc,
      maximizeFrame: true,
      imageFit: ImageFit.cover,
    };

    const toggleIsReadById = (id: string, e: any): void => {
      e.stopPropagation();
      dispatch({ type: "feed/ById/toggleIsRead", payload: id });
    };

    const toggleIsStarById = (id: string, e: any): void => {
      e.stopPropagation();
      dispatch({ type: "feed/ById/toggleIsStar", payload: id });
    };

    const toggleIsPinById = (id: string, e: any): void => {
      e.stopPropagation();
      dispatch({ type: "feed/ById/toggleIsPin", payload: id });
    };

    return item && typeof itemIndex === "number" && itemIndex > -1 ? (
      <div
        className="flex-wrap md:flex md:flex-nowrap border-b border-gray-300 pt-4 pb-4 cursor-pointer group hover:bg-gray-200"
        onClick={onClickFeed}
      >
        <div className="flex-shrink-0 w-full h-48 md:w-32 md:h-32 mb-4 md:mr-4">
          <Image className="mr-3 rounded-md" {...imageProps} />
        </div>
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
        <div className="cursor-pointer text-gray-600 text-lg font-bold leading-loose border-b border-gray-600">
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
    <>
      <GroupedList
        className={`${className} px-6`}
        items={items}
        onRenderCell={onRenderCell}
        groupProps={groupProps}
        groups={groups}
      />
    </>
  );
};

export default FeedsPane;
