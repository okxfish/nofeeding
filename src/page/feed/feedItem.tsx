import React, { useContext, useCallback, useRef, useEffect } from "react";
import {
  Text,
  IconButton,
  ImageFit,
  IIconProps,
  Image,
  Stack,
  CommandBar,
  useTheme,
  Icon,
  mergeStyleSets,
  ICommandBarItemProps,
} from "@fluentui/react";
import { default as api } from "../../api";
import queryString from "query-string";
import classnames from "classnames";
import { FeedProps } from "./types";
import { useMutation } from "react-query";
import { default as dayjs, Dayjs } from "dayjs";
import { ViewType, FeedThumbnailDisplayType } from "../../context/setting";
import Swipeout from "../../component/swipeout";

import {
  SettingContext,
  SetFeedItemContext,
  DispatchContext,
} from "../../context";
import { useWindowSize } from "react-use";
import { ScreenPosition } from "../../reducer";

export interface Props extends FeedProps {
  itemIndex: number;
  isSelected: boolean;
  onAboveRead(e: any, id: string, index: number): void;
}

const favoriteStarIcon: IIconProps = { iconName: "FavoriteStar" };
const favoriteStarFillIcon: IIconProps = { iconName: "FavoriteStarFill" };
const radioBtnOffIcon: IIconProps = { iconName: "RadioBtnOff" };
const radioBtnOnIcon: IIconProps = { iconName: "RadioBtnOn" };

const FeedItemComponent = ({
  id,
  title,
  summary,
  thumbnailSrc,
  sourceName,
  publishedTime,
  isRead,
  isStar,
  itemIndex,
  isSelected,
  className,
  rootClassName,
  itemClassName,
  onAboveRead,
}: Props) => {
  const dispatch = useContext(DispatchContext);
  const {
    layout: { viewType },
    feed: { feedThumbnailDisplayType },
  } = useContext(SettingContext);
  const setArticleDataById = useContext(SetFeedItemContext);
  const { palette } = useTheme();
  const { width: windowWidth } = useWindowSize();
  const markAsReadMutation = useMutation(
    ({ id, asUnread }: { id: string; asUnread?: boolean }): any =>
      api.inoreader.markArticleAsRead(id, asUnread),
    {
      onMutate: ({ id, asUnread }) => {
        setArticleDataById(id, (article) => {
          article.isRead = !asUnread;
        });
      },
      onError: (error, { id, asUnread }) => {
        setArticleDataById(id, (article) => {
          article.isRead = asUnread;
        });
      },
    }
  );

  // 文章标星
  const markAsStarMutation = useMutation(
    ({ id, isStar }: { id: string; isStar?: boolean }): any =>
      api.inoreader.markArticleAsStar(id, isStar),
    {
      onMutate: ({ id, isStar }) => {
        setArticleDataById(id, (article) => {
          article.isStar = isStar;
        });
      },
      onError: (error, { id, isStar }) => {
        setArticleDataById(id, (article) => {
          article.isStar = !isStar;
        });
      },
    }
  );

  // 标记文章已读/未读
  const onClick = useCallback(() => {
    const articleId = id;
    dispatch({ type: "CHANGE_SELECTED_ARTICLE", articleId });
    if(windowWidth <= 640){
      dispatch({ type: "CHANGE_SCREEN_POSITION", position: ScreenPosition.Right })
    } else if (viewType !== ViewType.threeway) {
      dispatch({ type: "OPEN_AIRTICLE_MODAL" });
    }
    markAsReadMutation.mutate({ id, asUnread: false });
  }, [viewType, id, dispatch, markAsReadMutation, windowWidth]);

  // 点击标星按钮
  const onStar = (e: any): void => {
    if (e) {
      e.stopPropagation();
    }
    markAsStarMutation.mutate({ id, isStar: !isStar });
  };

  // 点击标记已读/未读按钮
  const onRead = (e: any): void => {
    if (e) {
      e.stopPropagation();
    }
    markAsReadMutation.mutate({ id, asUnread: isRead });
  };

  const feedHeaderRender = (): React.ReactElement | null => {
    if (viewType === ViewType.list) {
      return null;
    }

    const thumbnaillElem: React.ReactElement = (
      <div
        className={`flex-shrink-0 h-24 w-24  mr-4 mb-0 rounded-lg overflow-hidden border flex items-center justify-center ${isRead ? "opacity-40" : ""
          }`}
        style={{
          backgroundColor: palette.neutralQuaternaryAlt,
          borderColor: palette.neutralQuaternaryAlt,
        }}
      >
        {thumbnailSrc ? (
          <Image
            className="select-none"
            src={thumbnailSrc}
            maximizeFrame={true}
            imageFit={ImageFit.cover}
          />
        ) : (
          <Icon
            iconName="FocalPoint"
            className=" text-5xl w-12 h-12 block"
            styles={{ root: { color: palette.neutralLighter } }}
          />
        )}
      </div>
    );

    switch (feedThumbnailDisplayType) {
      case FeedThumbnailDisplayType.alwaysDisplay:
        return thumbnaillElem;
      case FeedThumbnailDisplayType.displayWhenThumbnaillExist:
        return thumbnailSrc ? thumbnaillElem : null;
      case FeedThumbnailDisplayType.alwaysNotDisplay:
        return null;
      default:
        return null;
    }
  };

  const nowTime: Dayjs = dayjs();
  const relativePublishedTime: string = publishedTime.from(nowTime);

  const iconBtnStyle = {
    root: "px-0 rounded-md",
    icon: "mx-0",
  };

  const markAsReadCommandBarItem: ICommandBarItemProps = {
    iconProps: isRead ? radioBtnOffIcon : radioBtnOnIcon,
    iconOnly: true,
    key: "markThisAsRead",
    text: "mark this as read",
    className: "focus:outline-none",
    styles: iconBtnStyle,
    ariaLabel: "Mark as read",
    onClick: onRead,
    disabled: markAsReadMutation.isLoading,
  }

  const markAsStarCommandBarItem: ICommandBarItemProps = {
    iconProps: isStar ? favoriteStarFillIcon : favoriteStarIcon,
    iconOnly: true,
    key: "star",
    text: "favorite",
    className: classnames("focus:outline-none", {
      "text-yellow-300 hover:text-yellow-300": isStar,
    }),
    styles: iconBtnStyle,
    ariaLabel: "Favorite",
    onClick: onStar,
    disabled: markAsStarMutation.isLoading,
  }

  const markAboveAsReadCommandBarItem: ICommandBarItemProps = {
    iconProps: { iconName: "DoubleChevronUp" },
    iconOnly: true,
    key: "markAboveAsRead",
    text: "mark above as read",
    className: "focus:outline-none",
    styles: iconBtnStyle,
    ariaLabel: "Mark as read",
    onClick: (e) => onAboveRead(e, id, itemIndex)
  }

  const commandItems: ICommandBarItemProps[] = windowWidth < 640 ? [] : [markAsReadCommandBarItem];

  const overflowItems: ICommandBarItemProps[] = windowWidth < 640
    ? [markAsReadCommandBarItem, markAsStarCommandBarItem, markAboveAsReadCommandBarItem]
    : [markAsStarCommandBarItem, markAboveAsReadCommandBarItem];

  const actionButtonsElem = (
    <CommandBar items={commandItems} overflowItems={overflowItems} styles={{ root: ['px-0', 'h-6'] }} />
  );

  const classNames = mergeStyleSets({
    feed: [
      "relative z-10 group cursor-pointer px-4",
      {
        selectors: {
          "&:hover": {
            backgroundColor: palette.neutralLight,
          },
        },
      },
    ],
    title: ["text-base truncat-3 flex-1"]
  });

  const feedBodyRender = (): React.ReactElement | null => {
    if (viewType === ViewType.list) {
      return (
        <Stack
          horizontal
          verticalAlign="center"
          className={classnames("flex-1 overflow-hidden", {
            "opacity-40": isRead,
          })}
        >
          <Stack horizontal>
            <Text className={classnames(classNames.title, 'mr-2')}>{title}</Text>
          </Stack>
          <Stack className="flex-1" horizontal verticalAlign="center">
            <Text className="flex-1 text-xs text-gray-500" block nowrap title={sourceName}>
              {sourceName}
            </Text>
            <Text className="flex-0 text-xs text-gray-500" nowrap>
              {relativePublishedTime}
            </Text>
          </Stack>
        </Stack>
      )
    } else {
      return (
        <Stack
          verticalAlign="stretch"
          className={classnames("flex-1 overflow-hidden", {
            "opacity-40": isRead,
          })}
        >
          <Stack horizontal>
            <Text className={classnames(classNames.title, "mb-4")} >{title}</Text>
            {actionButtonsElem}
          </Stack>
          <Text className="flex-1 text-base w-full">{summary}</Text>
          <Stack horizontal verticalAlign="center">
            <Text className="flex-1 text-xs text-gray-500" block nowrap title={sourceName}>
              {sourceName}
            </Text>
            <Text className="flex-0 text-xs text-gray-500" nowrap>
              {relativePublishedTime}
            </Text>
          </Stack>
        </Stack>
      )
    }
  }

  return (
    <Swipeout
      className={`relative my-2 mx-0 sm:mx-2 rounded-none sm:rounded-md ${rootClassName}`}
      leftBtnsProps={windowWidth < 640 ? [
        {
          className: 'bg-yellow-300 text-white text-xl font-medium',
          text: (
            <Icon className="text-2xl" {...(isStar ? favoriteStarFillIcon : favoriteStarIcon)} />
          ),
          onClick: (e) => onStar(e),
        }
      ] : []}
      rightBtnsProps={windowWidth < 640 ? [
        {
          className: 'bg-green-400 text-white text-xl font-medium',
          text: (
            <Icon className="text-2xl" {...(isRead ? radioBtnOffIcon : radioBtnOnIcon)} />
          ),
          onClick: (e) => onRead(e),
        }
      ] : []}
      overswipeRatio={0.3}
      btnWidth={96}
    >
      <div
      >
        <Stack
          horizontal
          onClick={onClick}
          className={classnames(classNames.feed, itemClassName, {
            "py-1": viewType === ViewType.list,
            "py-3": viewType !== ViewType.list,
            "": isSelected,
          })}
        >
          {feedHeaderRender()}
          {feedBodyRender()}
          {viewType === ViewType.list ? actionButtonsElem : null}
        </Stack>
      </div>
    </Swipeout>
  );
};

export default React.memo(
  FeedItemComponent,
  (prevProps: Props, nextProps: Props) => {
    if (
      prevProps.id === nextProps.id &&
      prevProps.title === nextProps.title &&
      prevProps.summary === nextProps.summary &&
      prevProps.thumbnailSrc === nextProps.thumbnailSrc &&
      prevProps.content === nextProps.content &&
      prevProps.url === nextProps.url &&
      prevProps.sourceName === nextProps.sourceName &&
      prevProps.sourceID === nextProps.sourceID &&
      prevProps.publishedTime === nextProps.publishedTime &&
      prevProps.isRead === nextProps.isRead &&
      prevProps.isStar === nextProps.isStar &&
      prevProps.isInnerArticleShow === nextProps.isInnerArticleShow &&
      prevProps.itemIndex === nextProps.itemIndex &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.className === nextProps.className &&
      prevProps.rootClassName === nextProps.rootClassName &&
      prevProps.itemClassName === nextProps.itemClassName
    ) {
      return true;
    }
    return false;
  }
);
