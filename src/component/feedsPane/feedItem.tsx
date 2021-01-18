import {
  Text,
  IImageProps,
  ImageFit,
  TooltipHost,
  IconButton,
  IIconProps,
  IContextualMenuProps,
  Image,
} from "@fluentui/react";
import React, { useState, useRef, useEffect, Dispatch } from "react";
import { FeedProps } from "./types";
import Hammer, { DIRECTION_LEFT, DIRECTION_RIGHT } from "hammerjs";

export interface Props {
  nestingDepth?: number;
  item?: FeedProps;
  itemIndex?: number;
  onClickFeed?(e: any): void;
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

const initXOffset = 0;

enum StayPosition {
  left = 1,
  mid,
  right,
}

const FeedItem = ({
  nestingDepth,
  item,
  itemIndex,
  onClickFeed,
  dispatch,
}: Props) => {
  const [xOffset, setXOffset] = useState<number>(initXOffset);
  const [stayPosition, setStayPosition] = useState<StayPosition>(
    StayPosition.mid
  );
  const feedItemRef = useRef<any>(null);
  const hammerInstanceRef = useRef<any>(null);

  useEffect(() => {
    const thresholdMax = 80;
    const thresholdMin = 10;
    if (hammerInstanceRef && feedItemRef && feedItemRef.current) {
      hammerInstanceRef.current = new Hammer(feedItemRef.current);
      hammerInstanceRef.current.on("pan", function (ev) {
        if (
          ev.offsetDirection === DIRECTION_LEFT ||
          ev.offsetDirection === DIRECTION_RIGHT
        ) {
          console.log(
            `x: ${ev.deltaX}, y: ${ev.deltaY}, offsetD: ${ev.offsetDirection}, direction: ${ev.direction}`
          );
          const xOffsetAbs = Math.abs(ev.deltaX);
          if (xOffsetAbs > thresholdMin && xOffsetAbs < thresholdMax) {
            setXOffset(initXOffset + ev.deltaX);
            return;
          }
        }
      });

      hammerInstanceRef.current.on("panend", function (ev) {
        let endXOffset;
        if (Math.abs(ev.deltaX) > thresholdMin) {
          if (
            (stayPosition === StayPosition.left && ev.deltaX > 0) ||
            (stayPosition === StayPosition.right && ev.deltaX < 0)
          ) {
            endXOffset = 0;
            setStayPosition(StayPosition.mid);
          } else if (stayPosition === StayPosition.mid) {
            if (ev.deltaX > 0) {
              endXOffset = thresholdMax;
              setStayPosition(StayPosition.right);
            } else {
              endXOffset = -thresholdMax;
              setStayPosition(StayPosition.left);
            }
          }
        }

        if (typeof endXOffset !== 'undefined') {
          setXOffset(endXOffset);
        }
      });
    }
  }, []);

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
              xl:max-w-5xs
            "
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
      className="
        feed-item flex-wrap rounded-md  p-4 group
        transition cursor-pointer select-none
      hover:bg-gray-100 
        md:flex md:flex-nowrap 
      "
      ref={feedItemRef}
      onClick={onClickFeed}
      style={{ transform: `translateX(${xOffset}px)` }}
    >
      <div
        className="
          flex-shrink-0 w-full h-48 mb-4
          md:w-28 md:h-28 md:mr-4 md:mb-0
        "
      >
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

export default FeedItem;
