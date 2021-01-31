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
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import classnames from "classnames";
import { FeedProps } from "./types";
import Hammer, { DIRECTION_LEFT, DIRECTION_RIGHT } from "hammerjs";
import ArticlePane from "./../articlePane/index";
import { useUpdateEffect } from "react-use";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { ArticleContext } from "./../../context/article";

export interface Props {
  nestingDepth?: number;
  item?: FeedProps;
  itemIndex?: number;
  onClickFeed?(e?: FeedProps): void;
  onPinClick?(e?: any): void;
  onStarClick?(e?: any): void;
  onReadClick?(e?: any): void;
  onLeftSlide?(e?: any): void;
  onRightSlide?(e?: any): void;
}

const moreIcon: IIconProps = { iconName: "More" };
const favoriteStarIcon: IIconProps = { iconName: "FavoriteStar" };
const favoriteStarFillIcon: IIconProps = { iconName: "FavoriteStarFill" };
const radioBtnOffIcon: IIconProps = { iconName: "RadioBtnOff" };
const radioBtnOnIcon: IIconProps = { iconName: "RadioBtnOn" };

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
const thresholdMax = 160;
const thresholdMin = 10;
const slideBackAnimationDuration = 130;

const FeedItem = ({
  nestingDepth,
  item,
  itemIndex,
  onClickFeed,
  onPinClick,
  onStarClick,
  onReadClick,
  onLeftSlide = () => {},
  onRightSlide = () => {},
}: Props) => {
  const [xOffset, setXOffset] = useState<number>(initXOffset);
  const [slideBackAnimation, setSlideBackAnimation] = useState<boolean>(false);
  const { viewType } = useContext(ViewTypeContext);
  const article = useContext(ArticleContext);

  const feedItemRef = useRef<any>(null);
  const hammerInstanceRef = useRef<any>(null);

  // 处理滑动事件
  const handleOnPan = useCallback((ev: any) => {
    if (
      ev.offsetDirection === DIRECTION_LEFT ||
      ev.offsetDirection === DIRECTION_RIGHT
    ) {
      const xOffsetAbs = Math.abs(ev.deltaX);
      if (xOffsetAbs > thresholdMin && xOffsetAbs < thresholdMax) {
        setXOffset(initXOffset + ev.deltaX);
      }
    }
  }, []);

  const handleOnPanEnd = useCallback(
    (ev: any) => {
      if (ev.offsetDirection === DIRECTION_LEFT) {
        if (onLeftSlide) {
          onLeftSlide();
        }
      } else if (ev.offsetDirection === DIRECTION_RIGHT) {
        if (onRightSlide) {
          onRightSlide();
        }
      }

      setSlideBackAnimation(true);
      setXOffset(0);
      setTimeout(
        () => setSlideBackAnimation(false),
        slideBackAnimationDuration
      );
    },
    [onLeftSlide, onRightSlide]
  );

  // 订阅左右滑动的触摸事件
  useEffect(() => {
    const handleOnPan = (ev: any) => {
      let translateXMatch = /translateX\(-?(\d*px)\)/g.exec(
        feedItemRef.current.style.transform
      );

      if (!translateXMatch) {
        return null;
      }

      const translateX = parseFloat(translateXMatch[1]);
      // console.log(translateX);
      if (
        ev.offsetDirection !== DIRECTION_LEFT &&
        ev.offsetDirection !== DIRECTION_RIGHT
      ) {
        return null;
      }

      const xOffsetAbs = Math.abs(ev.deltaX);
      const xOffsetSign = ev.deltaX < 0 ? "-" : "";

      console.log(xOffsetAbs);

      if (xOffsetAbs < thresholdMin || translateX > thresholdMax) {
        return null;
      }

      const next =
        easeInCirc(xOffsetAbs / window.innerWidth) * window.innerWidth;
      window.requestAnimationFrame(
        () =>
          (feedItemRef.current.style.transform = `translateX(${xOffsetSign}${next}px)`)
      );
    };

    const handleOnPanEnd = (ev: any) => {
      if (
        ev.offsetDirection !== DIRECTION_LEFT &&
        ev.offsetDirection !== DIRECTION_RIGHT
      ) {
        return null;
      }

      if (ev.offsetDirection === DIRECTION_LEFT) {
        onLeftSlide();
      } else if (ev.offsetDirection === DIRECTION_RIGHT) {
        onRightSlide();
      }

      window.requestAnimationFrame(() => {
        // feedItemRef.current.style.transition = `transform ${slideBackAnimationDuration}ms ease-out`;
        feedItemRef.current.style.transform = `translateX(${0}px)`;
      });
      // feedItemRef.current.style.transform = `translateX(${0}px)`;
      // setSlideBackAnimation(true);
      // setTimeout(
      //   () => setSlideBackAnimation(false),
      //   slideBackAnimationDuration
      // );
    };

    const feedItemNode = feedItemRef.current;

    if (hammerInstanceRef && feedItemNode) {
      hammerInstanceRef.current = new Hammer(feedItemNode);
      hammerInstanceRef.current.on("pan", handleOnPan);
      hammerInstanceRef.current.on("panend", handleOnPanEnd);
    }

    return () => {
      if (hammerInstanceRef && feedItemRef && feedItemNode) {
        console.log(feedItemNode);
        hammerInstanceRef.current.off("pan", handleOnPan);
        hammerInstanceRef.current.off("panend", handleOnPanEnd);
      }
    };
  }, []);

  // 实现拖动动画
  useUpdateEffect(() => {
    window.requestAnimationFrame =
      requestAnimationFrame || window.requestAnimationFrame;
    const setNextTranslateX = () => {
      if (feedItemRef && feedItemRef.current) {
        feedItemRef.current.style.transform = `translateX(${xOffset}px)`;
      }
    };

    window.requestAnimationFrame(setNextTranslateX);
    setNextTranslateX();
  }, [xOffset]);

  const imageProps: IImageProps = {
    src: item?.thumbnailSrc,
    maximizeFrame: true,
    imageFit: ImageFit.cover,
  };

  if (!item || typeof itemIndex !== "number" || itemIndex < 0) {
    return null;
  }

  const feedFooterElem: React.ReactElement = (
    <div
      className={classnames(
        "hidden items-center justify-end",
        "sm:justify-between sm:flex",
        "md:justify-end",
        "xl:justify-between",
        {
          "flex-col": viewType !== ViewType.list,
        }
      )}
    >
      <IconButton
        className="focus:outline-none"
        iconProps={item.isRead ? radioBtnOnIcon : radioBtnOffIcon}
        title="mark as read"
        ariaLabel="Mark as read"
        disabled={false}
        onClick={onReadClick}
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
        menuProps={menuProps}
        iconProps={moreIcon}
        onRenderMenuIcon={() => null}
        title="more"
        ariaLabel="More"
        disabled={false}
        checked={false}
      />
    </div>
  );

  return (
    <div className="overflow-x-hidden relative" >
      <div
        className="h-full flex items-center justify-center bg-red-400 absolute left-0 top-0"
        style={{ width: thresholdMax }}
      >
        <span className="text-2xl text-white">star</span>
      </div>
      <div
        className="h-full flex items-center justify-center bg-blue-400 absolute right-0 top-0"
        style={{ width: thresholdMax }}
      >
        <span className="text-2xl text-white">read</span>
      </div>
      <div
        ref={feedItemRef}
        onClick={onClickFeed?.bind(null, item)}
        style={{
          transition: `transform ${slideBackAnimationDuration}ms ease-out`,
        }}
        className={classnames(
          "feed-item flex relative z-10 p-4 group bg-white cursor-pointer select-none flex-wrap",
          "md:flex-nowrap hover:bg-gray-50",
          {
            "border-b": viewType === ViewType.list,
            "py-2": viewType === ViewType.list,
          }
        )}
      >
        {viewType === 1 ? null : (
          <div
            className={`flex-shrink-0 w-28 h-28  mr-4 mb-0 ${
              item.isRead ? "opacity-40" : ""
            }`}
          >
            <Image className="mr-3 rounded-md select-none" {...imageProps} />
          </div>
        )}
        <div
          className={classnames("flex flex-1", {
            "opacity-40": item.isRead,
            "flex-col": viewType !== ViewType.list,
            "items-center": viewType === ViewType.list,
          })}
        >
          <div
            className={classnames(
              "relative flex items-start text-lg text-gray-800 font-medium",
              {
                "text-base": viewType === ViewType.list,
                "mr-2": viewType === ViewType.list,
                "mb-2": viewType !== ViewType.list,
              }
            )}
          >
            {item.title}
          </div>
          <div
            className={classnames("flex-1 text-base text-gray-600 w-full", {
              truncate: viewType === ViewType.list,
            })}
          >
            {item.summary}
          </div>
          <div className="flex items-center">
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
        </div>
        {feedFooterElem}
      </div>
      {item.isInnerArticleShow ? (
        <ArticlePane className="bg-white relative z-10 border-b" article={article} />
      ) : null}
    </div>
  );
};

export default FeedItem;

function easeInCirc(x: number): number {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}
