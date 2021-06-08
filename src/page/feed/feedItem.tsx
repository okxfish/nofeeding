import React, { useContext } from "react";
import {
  Text,
  IconButton,
  ImageFit,
  IIconProps,
  Image,
  Stack,
  IButtonProps,
} from "@fluentui/react";
import classnames from "classnames";
import { FeedProps } from "./types";
import ArticlePane from "./articlePane";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { default as dayjs, Dayjs } from "dayjs";
import {
  FeedThumbnailDisplayType,
  SettingContext,
} from "../../context/setting";

export interface Props extends FeedProps {
  itemIndex: number;
  isSelected: boolean;
}

const favoriteStarIcon: IIconProps = { iconName: "FavoriteStar" };
const favoriteStarFillIcon: IIconProps = { iconName: "FavoriteStarFill" };
const radioBtnOffIcon: IIconProps = { iconName: "RadioBtnOff" };
const radioBtnOnIcon: IIconProps = { iconName: "RadioBtnOn" };

const FeedItem = ({
  data,
  itemIndex,
  isSelected,
  className,
  rootClassName,
  itemClassName,
  onClick = () => {},
  onRead = () => {},
  onStar = () => {},
}: Props) => {
  const { viewType } = useContext(ViewTypeContext);
  const { setting } = useContext(SettingContext);

  const feedHeaderRender = (): React.ReactElement | null => {
    if (viewType === ViewType.list) {
      return null;
    }

    const thumbnaillElem: React.ReactElement = (
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

    switch (setting.feed.feedThumbnailDisplayType) {
      case FeedThumbnailDisplayType.alwaysDisplay:
        return thumbnaillElem;
      case FeedThumbnailDisplayType.displayWhenThumbnaillExist:
        return data.thumbnailSrc ? thumbnaillElem : null;
      case FeedThumbnailDisplayType.alwaysNotDisplay:
        return null;
      default:
        return null;
    }
  };

  const nowTime: Dayjs = dayjs();
  const relativePublishedTime: string = data.publishedTime.from(nowTime);

  const actionButtonsElem = (
    <div>
        <IconButton
          className={classnames(
            "focus:outline-none text-gray-500 hover:text-gray-500",
            {
              "text-yellow-300 hover:text-yellow-300": data.isStar,
            }
          )}
          styles={{ root: "px-0 w-auto ml-4", icon: "mx-0" }}
          iconProps={data.isStar ? favoriteStarFillIcon : favoriteStarIcon}
          title="favorite"
          ariaLabel="Favorite"
          onClick={(e) => onStar(data, itemIndex, e)}
          {...data.starButtonProps}
        />
        <IconButton
          className="focus:outline-none text-gray-500 hover:text-gray-500"
          styles={{ root: "px-0 w-auto ml-4", icon: "mx-0" }}
          iconProps={data.isRead ? radioBtnOffIcon : radioBtnOnIcon}
          title="mark as read"
          ariaLabel="Mark as read"
          onClick={(e) => onRead(data, itemIndex, e)}
          {...data.unreadMarkButtonProps}
        />
    </div>
  );

  const feedBodyElem: React.ReactElement | null = (
    <Stack
      horizontal={viewType === ViewType.list}
      verticalAlign={viewType === ViewType.list ? "center" : "stretch"}
      className={classnames("flex-1 overflow-hidden", {
        "opacity-40": data.isRead,
      })}
    >
      <Stack horizontal>
        <Text
          className={classnames("text-base flex-1", {
            "mr-2": viewType === ViewType.list,
            "mb-4": viewType !== ViewType.list,
          })}
        >
          {data.title}
        </Text>
        {viewType === ViewType.list ? null : actionButtonsElem}
      </Stack>
      <Text className="flex-1 text-base w-full">{data.summary}</Text>
      <Stack horizontal verticalAlign="center" className="text-gray-400">
        <Text className="flex-1 text-sm" block nowrap title={data.sourceName}>
          {data.sourceName}
        </Text>
        <Text className="flex-0 text-sm" nowrap>
          {relativePublishedTime}
        </Text>
      </Stack>
    </Stack>
  );

  return (
    <div className={`overflow-x-hidden relative ${rootClassName}`}>
      <Stack
        horizontal
        onClick={(e) => onClick(data, itemIndex, e)}
        className={classnames(
          "relative z-10 group cursor-pointer select-none hover:bg-blue-50",
          itemClassName,
          {
            "py-1 border-b": viewType === ViewType.list,
            "py-4": viewType !== ViewType.list,
            "bg-blue-100": isSelected,
          }
        )}
      >
        {feedHeaderRender()}
        {feedBodyElem}
        {viewType === ViewType.list ? actionButtonsElem : null}
      </Stack>
      {data.isInnerArticleShow ? (
        <ArticlePane className="relative z-10 border-b bg-gray-50" />
      ) : null}
    </div>
  );
};

export default FeedItem;
