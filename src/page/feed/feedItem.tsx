import React, { useContext, useCallback, useRef, useEffect } from "react";
import {
  Text,
  IconButton,
  ImageFit,
  IIconProps,
  Image,
  Stack,
  NeutralColors,
  useTheme,
  Icon,
  mergeStyleSets,
} from "@fluentui/react";
import { default as api } from "../../api";
import classnames from "classnames";
import { FeedProps } from "./types";
import ArticlePane from "./articlePane";
import { useMutation } from "react-query";
import { default as dayjs, Dayjs } from "dayjs";
import { ViewType, FeedThumbnailDisplayType } from "../../context/setting";
import {
  SettingContext,
  SetFeedItemContext,
  DispatchContext,
} from "../../context";

export interface Props extends FeedProps {
  itemIndex: number;
  isSelected: boolean;
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
  content,
  url,
  sourceName,
  sourceID,
  publishedTime,
  isRead,
  isStar,
  isInnerArticleShow,
  itemIndex,
  isSelected,
  className,
  rootClassName,
  itemClassName,
}: Props) => {
  const dispatch = useContext(DispatchContext);
  const {
    layout: { viewType },
    feed: { feedThumbnailDisplayType },
    isDarkMode,
  } = useContext(SettingContext);
  const setArticleDataById = useContext(SetFeedItemContext);
  const { palette } = useTheme();

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
    if (viewType === ViewType.card) {
      dispatch({ type: "OPEN_AIRTICLE_MODAL" });
    }
    markAsReadMutation.mutate({ id, asUnread: false });
  }, [viewType, id, dispatch, markAsReadMutation]);

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
        className={`flex-shrink-0 h-24 w-24  mr-4 mb-0 rounded-lg overflow-hidden border flex items-center justify-center ${
          isRead ? "opacity-40" : ""
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

  const actionButtonsElem = (
    <div className="space-x-2">
      <IconButton
        className={classnames("focus:outline-none", {
          "text-yellow-300 hover:text-yellow-300": isStar,
        })}
        styles={iconBtnStyle}
        iconProps={isStar ? favoriteStarFillIcon : favoriteStarIcon}
        title="favorite"
        ariaLabel="Favorite"
        onClick={onStar}
        disabled={markAsStarMutation.isLoading}
      />
      <IconButton
        className="focus:outline-none"
        styles={iconBtnStyle}
        iconProps={isRead ? radioBtnOffIcon : radioBtnOnIcon}
        title="mark as read"
        ariaLabel="Mark as read"
        onClick={onRead}
        disabled={markAsReadMutation.isLoading}
      />
    </div>
  );

  const feedBodyElem: React.ReactElement | null = (
    <Stack
      horizontal={viewType === ViewType.list}
      verticalAlign={viewType === ViewType.list ? "center" : "stretch"}
      className={classnames("flex-1 overflow-hidden", {
        "opacity-40": isRead,
      })}
    >
      <Stack horizontal>
        <Text
          className={classnames("text-base flex-1", {
            "mr-2": viewType === ViewType.list,
            "mb-4": viewType !== ViewType.list,
          })}
        >
          {title}
        </Text>
        {viewType === ViewType.list ? null : actionButtonsElem}
      </Stack>
      <Text className="flex-1 text-base w-full">{summary}</Text>
      <Stack horizontal verticalAlign="center">
        <Text className="flex-1 text-sm" block nowrap title={sourceName}>
          {sourceName}
        </Text>
        <Text className="flex-0 text-sm" nowrap>
          {relativePublishedTime}
        </Text>
      </Stack>
    </Stack>
  );

  const classNames = mergeStyleSets({
    feed: [
      "relative z-10 group cursor-pointer px-6",
      {
        selectors: {
          "&:hover": {
            backgroundColor: palette.neutralLight,
          },
        },
      },
    ],
  });

  return (
    <div
      className={`overflow-x-hidden relative my-3 mx-4 rounded-md ${rootClassName}`}
    >
      <Stack
        horizontal
        onClick={onClick}
        className={classnames(classNames.feed, itemClassName, {
          "py-1": viewType === ViewType.list,
          "py-4": viewType !== ViewType.list,
          "": isSelected,
        })}
      >
        {feedHeaderRender()}
        {feedBodyElem}
        {viewType === ViewType.list ? actionButtonsElem : null}
      </Stack>
      {isInnerArticleShow ? <ArticlePane className="relative z-10" /> : null}
    </div>
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
