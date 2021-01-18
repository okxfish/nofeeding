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
import React, { useState, useRef, useEffect } from "react";
import { FeedProps } from "./types";
import Hammer, { DIRECTION_LEFT, DIRECTION_RIGHT } from "hammerjs";
import throttle from "lodash.throttle";
export interface Props {
  nestingDepth?: number;
  item?: FeedProps;
  itemIndex?: number;
  onClickFeed?(e?: any): void;
  onPinClick?(e?: any): void;
  onStarClick?(e?: any): void;
  onReadClick?(e?: any): void;
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
  onPinClick,
  onStarClick,
  onReadClick,
}: Props) => {
  const [xOffset, setXOffset] = useState<number>(initXOffset);
  const [stayPosition, setStayPosition] = useState<StayPosition>(
    StayPosition.mid
  );
  const feedItemRef = useRef<any>(null);
  const hammerInstanceRef = useRef<any>(null);

  useEffect(() => {
    const thresholdMax = 200;
    const thresholdMin = 10;

    const handleOnPan = throttle((ev: any) => {
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
    }, 90);

    const handleOnPanEnd = (ev: any) => {
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

      if (typeof endXOffset !== "undefined") {
        console.log(endXOffset);
        setXOffset(endXOffset);
      }
    };

    const feedItemNode = feedItemRef.current;

    if (hammerInstanceRef && feedItemNode) {
      hammerInstanceRef.current = new Hammer(feedItemNode);
      hammerInstanceRef.current.on("pan", handleOnPan);
      hammerInstanceRef.current.on("panend", handleOnPanEnd);
    }

    return () => {
      if (hammerInstanceRef && feedItemRef && feedItemNode) {
        hammerInstanceRef.current.off("pan", handleOnPan);
        hammerInstanceRef.current.off("panend", handleOnPanEnd);
      }
    };
  }, [stayPosition]);

  const imageProps: IImageProps = {
    src: item?.thumbnailSrc,
    maximizeFrame: true,
    imageFit: ImageFit.cover,
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
          onClick={onPinClick}
        />
        <IconButton
          className="focus:outline-none"
          iconProps={item.isStar ? favoriteStarFillIcon : favoriteStarIcon}
          title="favorite"
          ariaLabel="Favorite"
          disabled={false}
          onClick={onStarClick}
        />
        <IconButton
          className="focus:outline-none"
          iconProps={item.isRead ? readingModeSolidIcon : readingModeIcon}
          title="mark as read"
          ariaLabel="Mark as read"
          disabled={false}
          onClick={onReadClick}
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
      bg-gray-500
      "
      onClick={onClickFeed}
    >
      <div
        ref={feedItemRef}
        style={{ transform: `translateX(${xOffset}px)` }}
        className="bg-gray-50 p-4 feed-item flex-wrap group
      transition cursor-pointer select-none
    hover:bg-gray-100 
      md:flex md:flex-nowrap "
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
            <span className="flex-1">{item.title}{stayPosition}</span>
          </div>
          <div className="flex-1 text-base text-gray-600 w-full">
            {item.summary}
          </div>
          {feedFooterElem}
        </div>
      </div>
    </div>
  );
};

export default FeedItem;
