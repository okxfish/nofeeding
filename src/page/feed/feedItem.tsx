import React, { useContext, useCallback, useRef, useEffect } from "react";
import {
    Text,
    ImageFit,
    IIconProps,
    Image,
    Stack,
    CommandBar,
    useTheme,
    Icon,
    mergeStyleSets,
    ICommandBarItemProps,
    IconButton,
} from "@fluentui/react";
import { default as api } from "../../api";
import classnames from "classnames";
import { FeedProps } from "./types";
import { useMutation } from "react-query";
import { default as dayjs, Dayjs } from "dayjs";
import Swipeout from "../../component/swipeout";

import { SetFeedItemContext } from "../../context";
import { useWindowSize } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../model";
import { ModalKeys } from "../../model/globalModal";
import {
    FeedThumbnailDisplayType,
    FeedView,
    ViewType,
} from "../../model/userInterface";
import { ScreenPosition } from "../../model/app";
import { useTranslation } from "react-i18next";

export interface Props extends FeedProps {
    itemIndex: number;
    isSelected: boolean;
    sourceIcon?: string;
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
    sourceID,
    sourceIcon,
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
    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );
    const feedView = useSelector<RootState, any>(
        (state) => state.userInterface.feedView
    );
    const feedThumbnailDisplayType = useSelector<RootState, any>(
        (state) => state.userInterface.feedThumbnailDisplayType
    );

    const dispatch = useDispatch<Dispatch>();

    const setArticleDataById = useContext(SetFeedItemContext);

    const { palette } = useTheme();
    const { width: windowWidth } = useWindowSize();
    const { t } = useTranslation(['translation', 'articleAction']);

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
        dispatch.app.changeSelectedArticle(articleId);
        if (windowWidth <= 640) {
            dispatch.app.changeActivedScreen(ScreenPosition.Right);
        } else if (viewType !== ViewType.threeway) {
            dispatch.globalModal.openModal(ModalKeys.ArticleModal);
        }
        markAsReadMutation.mutate({ id, asUnread: false });
    }, [viewType, id, markAsReadMutation, windowWidth, dispatch]);

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

    const nowTime: Dayjs = dayjs();
    const relativePublishedTime: string = publishedTime.from(nowTime);

    const iconBtnStyle = {
        root: "px-0 rounded-md",
        icon: "mx-0",
    };

    const markAsReadCommonProps = {
        iconProps: isRead ? radioBtnOffIcon : radioBtnOnIcon,
        onClick: onRead,
        disabled: markAsReadMutation.isLoading,
        styles: iconBtnStyle,
    };

    const markAsReadCommandBarItem: ICommandBarItemProps = {
        ...markAsReadCommonProps,
        iconOnly: true,
        key: "markThisAsRead",
        text: t("articleAction:read"),
        className: "focus:outline-none",
    };

    const markAsStarCommandBarItem: ICommandBarItemProps = {
        iconProps: isStar ? favoriteStarFillIcon : favoriteStarIcon,
        iconOnly: true,
        key: "star",
        text: t("articleAction:star"),
        className: classnames("focus:outline-none", {
            "text-yellow-300 hover:text-yellow-300": isStar,
        }),
        styles: iconBtnStyle,
        onClick: onStar,
        disabled: markAsStarMutation.isLoading,
    };

    const markAboveAsReadCommandBarItem: ICommandBarItemProps = {
        iconProps: { iconName: "DoubleChevronUp" },
        iconOnly: true,
        key: "markAboveAsRead",
        text: t("articleAction:mark above as read"),
        className: "focus:outline-none",
        styles: iconBtnStyle,
        onClick: (e) => onAboveRead(e, id, itemIndex),
    };

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
        title: ["text-base truncat-3 flex-1"],
    });

    const feedThumbnailRender = (
        className?: string
    ): React.ReactElement | null => {
        const thumbnaillElem: React.ReactElement = (
            <div
                className={classnames(
                    "flex-shrink-0 h-24 w-24 mb-0 rounded-lg overflow-hidden border flex items-center justify-center",
                    className,
                    {
                        "opacity-40": isRead,
                    }
                )}
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

    const feedItemContentClassName = classnames("flex-1 overflow-hidden", {
        "opacity-40": isRead,
    });

    const listViewRender = (): React.ReactElement | null => {
        return (
            <Stack
                horizontal
                verticalAlign="center"
                className={classnames(feedItemContentClassName)}
            >
                <Text className={classnames(classNames.title, "mr-2")}>
                    {title}
                </Text>
                <Stack
                    className="flex-1 space-x-2"
                    horizontal
                    verticalAlign="center"
                >
                    <Text
                        className="text-xs text-gray-500"
                        block
                        nowrap
                        title={sourceName}
                    >
                        {sourceName}
                    </Text>
                    <Text className="flex-0 text-xs text-gray-500" nowrap>
                        {relativePublishedTime}
                    </Text>
                </Stack>
                <CommandBar
                    items={[
                        markAboveAsReadCommandBarItem,
                        markAsStarCommandBarItem,
                        markAsReadCommandBarItem,
                    ]}
                    styles={{ root: ["px-0", "h-6"] }}
                />
            </Stack>
        );
    };

    const leftCoverViewRender = (): React.ReactElement | null => {
        return (
            <Stack horizontal className="w-full space-x-4">
                {feedThumbnailRender()}
                <Stack
                    verticalAlign="stretch"
                    className={feedItemContentClassName}
                >
                    <Stack horizontal>
                        <Text className={classnames(classNames.title, "mb-4")}>
                            {title}
                        </Text>
                        <CommandBar
                            items={[]}
                            overflowItems={[
                                markAsStarCommandBarItem,
                                markAboveAsReadCommandBarItem,
                            ]}
                            styles={{ root: ["px-0", "h-6"] }}
                        />
                    </Stack>
                    <Stack
                        horizontal
                        verticalAlign="center"
                        className="space-x-2"
                    >
                        <Text
                            className="flex-1 text-xs text-gray-500"
                            block
                            nowrap
                            title={sourceName}
                        >
                            {sourceName}
                        </Text>
                        <Text className="flex-0 text-xs text-gray-500" nowrap>
                            {relativePublishedTime}
                        </Text>
                        <IconButton {...markAsReadCommonProps} />
                    </Stack>
                </Stack>
            </Stack>
        );
    };

    const rightCoverViewRender = (): React.ReactElement | null => {
        return (
            <Stack verticalAlign="stretch" className={feedItemContentClassName}>
                <Stack
                    horizontal
                    verticalAlign="stretch"
                    className="mb-3 space-x-4"
                >
                    <Text className={classNames.title}>{title}</Text>
                    {feedThumbnailRender()}
                </Stack>
                <Stack horizontal verticalAlign="center" className="space-x-2">
                    <Text
                        className="text-xs text-gray-500"
                        block
                        nowrap
                        title={sourceName}
                    >
                        {sourceName}
                    </Text>
                    <Text className="flex-0 text-xs text-gray-500" nowrap>
                        {relativePublishedTime}
                    </Text>
                    <div className="flex-1" />
                    <CommandBar
                        items={[]}
                        overflowItems={[
                            markAsStarCommandBarItem,
                            markAboveAsReadCommandBarItem,
                        ]}
                        styles={{ root: ["px-0", "h-6"] }}
                    />
                    <IconButton {...markAsReadCommonProps} />
                </Stack>
            </Stack>
        );
    };

    const socialMediaViewRender = (): React.ReactElement | null => {
        return (
            <Stack
                verticalAlign="stretch"
                horizontal
                className={classnames(feedItemContentClassName, "space-x-4")}
            >
                <img src={sourceIcon} className="w-8 h-8 rounded-full flex-0" />
                <Stack horizontalAlign="stretch" className="space-y-2 flex-1">
                    <Stack horizontal className="space-x-2">
                        <Text
                            className="font-semibold block nowrap"
                            title={sourceName}
                        >
                            {sourceName}
                        </Text>
                        <Text className="text-gray-500" nowrap>
                            {relativePublishedTime}
                        </Text>
                    </Stack>
                    <Text className={classNames.title}>{title}</Text>
                    {feedThumbnailRender("w-full h-auto max-h-sm max-w-lg")}
                    <CommandBar
                        className=" "
                        items={[
                            markAsStarCommandBarItem,
                            markAboveAsReadCommandBarItem,
                            markAsReadCommandBarItem,
                        ]}
                        overflowItems={[]}
                        styles={{
                            root: ["w-full", "px-0", "h-6"],
                            primarySet: ["justify-between"],
                        }}
                    />
                </Stack>
            </Stack>
        );
    };

    const feedBodyRender = (): React.ReactElement | null => {
        if (viewType === ViewType.list) {
            return listViewRender();
        } else {
            if (feedView === FeedView.RightCover) {
                return rightCoverViewRender();
            } else if (feedView === FeedView.SocialMedia) {
                return socialMediaViewRender();
            } else {
                return leftCoverViewRender();
            }
        }
    };

    return (
        <Swipeout
            className={`relative my-2 mx-0 sm:mx-2 rounded-none sm:rounded-md ${rootClassName}`}
            leftBtnsProps={
                windowWidth < 640
                    ? [
                          {
                              className:
                                  "bg-yellow-300 text-white text-xl font-medium",
                              text: (
                                  <Icon
                                      className="text-2xl"
                                      {...(isStar
                                          ? favoriteStarFillIcon
                                          : favoriteStarIcon)}
                                  />
                              ),
                              onClick: (e) => onStar(e),
                          },
                      ]
                    : []
            }
            rightBtnsProps={
                windowWidth < 640
                    ? [
                          {
                              className:
                                  "bg-green-400 text-white text-xl font-medium",
                              text: (
                                  <Icon
                                      className="text-2xl"
                                      {...(isRead
                                          ? radioBtnOffIcon
                                          : radioBtnOnIcon)}
                                  />
                              ),
                              onClick: (e) => onRead(e),
                          },
                      ]
                    : []
            }
            overswipeRatio={0.3}
            btnWidth={96}
        >
            <div
                className={classnames(classNames.feed, itemClassName, {
                    "py-1": viewType === ViewType.list,
                    "py-3": viewType !== ViewType.list,
                    "": isSelected,
                })}
                onClick={onClick}
            >
                {feedBodyRender()}
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
            prevProps.url === nextProps.url &&
            prevProps.sourceName === nextProps.sourceName &&
            prevProps.sourceID === nextProps.sourceID &&
            prevProps.sourceIcon === nextProps.sourceIcon &&
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
