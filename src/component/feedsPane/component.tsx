import { default as React, Dispatch } from "react";
import {
  Text,
  Image,
  ImageFit,
  ActionButton,
  IconButton,
  IIconProps,
  IContextualMenuProps,
  IImageProps,
  GroupedList,
  IGroup,
  IGroupRenderProps,
  IGroupHeaderProps,
} from "office-ui-fabric-react";
import { FeedProps } from "./types";
import { TooltipHost } from "office-ui-fabric-react";
import "./style.css";
export interface Props {
  className?: string;
  onClickFeed?(): any;
  items: FeedProps[];
  groups: IGroup[];
  isSidePaneOpen: boolean;
  dispatch: Dispatch<any>;
}

const moreIcon: IIconProps = { iconName: "More"};
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

    if (!item || typeof itemIndex !== "number" || itemIndex < 0) {
      return null;
    }

    const feedFooterElem: React.ReactElement = (
      <div className="flex items-center w-full flex-wrap">
        <div className="flex items-center flex-1">
          <TooltipHost content={item.sourceName} closeDelay={500}>
            <Text
              className="
              text-sm text-gray-400 max-w-xs
              md:max-w-5xs
              lg:max-w-xs
              xl:max-w-5xs"
              block
              nowrap
            >
              {item.sourceName}
            </Text>
          </TooltipHost>
          <Text className="text-sm text-gray-400" nowrap>
            /{item.time}
          </Text>
        </div>
        <div
          className="
            flex items-center justify-end 
            sm:justify-between sm:w-full
            md:justify-end md:w-auto
            xl:justify-between xl:w-full
        "
        >
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
    );

    return (
      <div
        className="feed-item flex-wrap rounded-md md:flex md:flex-nowrap p-4 group transition cursor-pointer hover:bg-gray-100"
        onClick={onClickFeed}
      >
        <div className="
          flex-shrink-0 w-full h-48 mb-4
          md:w-28 md:h-28 md:mr-4 md:mb-0
        ">
          <Image className="mr-3 rounded-md select-none" {...imageProps} />
        </div>
        <div className="flex flex-col flex-1">
          <div className="relative flex items-start mb-2 text-lg text-gray-800 leading-none font-medium">
            <span className="flex-1">{item.title}</span>
          </div>
          <div className="flex-1 text-base text-gray-600 w-full">
            {item.summary}
          </div>
          {feedFooterElem}
        </div>
      </div>
    );
  };

  const onRenderHeader = (props?: IGroupHeaderProps): JSX.Element | null => {
    if (props && props.group) {
      return (
        <div className="flex items-center h-10 px-4 cursor-pointer text-gray-600 text-lg font-bold leading-loose border-b border-gray-400">
          <div className="flex-1">{props.group!.name}</div>
          <span className="font-normal">{props.group.count}</span>
        </div>
      );
    } else {
      return null;
    }
  };

  const onRenderFooter = (): React.ReactElement | null => {
    return (
      <div className="flex justify-end px-4 pt-4 pb-6 border-t border-gray-400">
        <ActionButton className="text-blue-500 text-base mr-0 px-0">
          mark this group as read
        </ActionButton>
      </div>
    );
  };

  const groupProps: IGroupRenderProps = {
    onRenderHeader: onRenderHeader,
    onRenderFooter: onRenderFooter,
  };

  return (
    <>
      <GroupedList
        className={`${className}`}
        items={items}
        onRenderCell={onRenderCell}
        onShouldVirtualize={() => false}
        groupProps={groupProps}
        groups={groups}
      />
    </>
  );
};

export default FeedsPane;
