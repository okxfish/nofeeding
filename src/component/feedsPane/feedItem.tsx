import React, { useRef, useContext } from "react";
import {
  Text,
  IconButton,
  ImageFit,
  TooltipHost,
  IIconProps,
  Image,
} from "@fluentui/react";
import classnames from "classnames";
import { FeedProps } from "./types";
import ArticlePane from "./../articlePane/index";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { default as dayjs, Dayjs } from "dayjs";

export interface Props extends FeedProps {
  itemIndex: number;
}

const favoriteStarIcon: IIconProps = { iconName: "FavoriteStar" };
const favoriteStarFillIcon: IIconProps = { iconName: "FavoriteStarFill" };
const radioBtnOffIcon: IIconProps = { iconName: "RadioBtnOff" };
const radioBtnOnIcon: IIconProps = { iconName: "RadioBtnOn" };

const FeedItem = ({
  data,
  itemIndex,
  className,
  onClick = () => {},
  onRead = () => {},
  onStar = () => {},
}: Props) => {
  const { viewType } = useContext(ViewTypeContext);
  const feedItemRef = useRef<HTMLDivElement>(null);

  const feedHeaderElem: React.ReactElement | null =
    viewType === 1 ? null : (
      <div
        className={`flex-shrink-0 h-24 w-24  mr-4 mb-0 rounded-md overflow-hidden bg-gray-300 ${
          data.isRead ? "opacity-40" : ""
        }`}
      >
        <Image
          className="mr-3  select-none"
          src={data.thumbnailSrc}
          maximizeFrame={true}
          imageFit={ImageFit.cover}
        />
      </div>
    );

  const nowTime: Dayjs = dayjs();
  const relativePublishedTime: string = data.publishedTime.from(nowTime);
  const feedBodyElem: React.ReactElement | null = (
    <div
      className={classnames("flex flex-1", {
        "opacity-40": data.isRead,
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
        {data.title}
      </div>
      <div
        className={classnames("flex-1 text-base text-gray-600 w-full", {
          truncate: viewType === ViewType.list,
        })}
      >
        {data.summary}
      </div>
      <div className="flex items-center">
        <TooltipHost content={data.sourceName} closeDelay={500}>
          <Text
            className=" text-sm text-gray-400 max-w-xs md:max-w-5xs lg:max-w-xs xl:max-w-5xs"
            block
            nowrap
          >
            {data.sourceName}
          </Text>
        </TooltipHost>
        <Text className="text-sm text-gray-400" nowrap>
          /{relativePublishedTime}
        </Text>
      </div>
    </div>
  );

  const feedFooterElem: React.ReactElement = (
    <div
      className={classnames(
        "hidden items-center justify-end sm:justify-between sm:flex md:justify-end xl:justify-between",
        {
          "flex-col": viewType !== ViewType.list,
        }
      )}
    >
      <IconButton
        className="focus:outline-none"
        iconProps={data.isRead ? radioBtnOffIcon : radioBtnOnIcon}
        title="mark as read"
        ariaLabel="Mark as read"
        disabled={false}
        onClick={(e) => onRead(data, itemIndex, e)}
      />
      <IconButton
        className={classnames("focus:outline-none", {
          "text-yellow-300 hover:text-yellow-300": data.isStar,
        })}
        iconProps={data.isStar ? favoriteStarFillIcon : favoriteStarIcon}
        title="favorite"
        ariaLabel="Favorite"
        disabled={false}
        onClick={(e) => onStar(data, itemIndex, e)}
      />
    </div>
  );

  return (
    <div className={`overflow-x-hidden relative ${className}`}>
      <div
        ref={feedItemRef}
        onClick={(e) => onClick(data, itemIndex, e)}
        className={classnames(
          "feed-item flex relative z-10 p-4 group bg-white cursor-pointer select-none flex-wrap md:flex-nowrap hover:bg-gray-50",
          {
            "py-1 border-b": viewType === ViewType.list,
          }
        )}
      >
        {feedHeaderElem}
        {feedBodyElem}
        {feedFooterElem}
      </div>
      {data.isInnerArticleShow ? (
        <ArticlePane className="relative z-10 border-b bg-gray-50" />
      ) : null}
    </div>
  );
};

export default FeedItem;
