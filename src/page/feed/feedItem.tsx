import React from "react";
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
import classnames from "classnames";
import { FeedProps } from "./types";
import { default as dayjs, Dayjs } from "dayjs";
import Swipeout from "../../component/swipeout";
import { useWindowSize } from "react-use";
import { useSelector } from "react-redux";
import { RootState } from "../../model";
import {
    FeedThumbnailDisplayType,
    FeedView,
    ViewType,
} from "../../model/userInterface";
import { useTranslation } from "react-i18next";

export interface Props extends FeedProps {
    itemIndex: number;
    isSelected?: boolean;
    sourceIcon?: string;
    onStar(e: any, id:string, isStar?:boolean): void;
    onRead(e: any, id:string, isRead?:boolean): void;
    onClick(e: any, id:string): void;
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
    onStar,
    onRead,
    onClick,
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

    const { palette } = useTheme();
    const { width: windowWidth } = useWindowSize();
    const { t } = useTranslation(["translation", "articleAction"]);

    const nowTime: Dayjs = dayjs();
    const relativePublishedTime: string = publishedTime.from(nowTime);

    const iconBtnStyle = {
        root: "px-0 rounded-md",
        icon: "mx-0",
    };

    const markAsReadCommonProps = {
        iconProps: isRead ? radioBtnOffIcon : radioBtnOnIcon,
        onClick: (e) => onRead(e, id, isRead),
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
        onClick: (e)=>onStar(e, id, isStar),
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
            className={`relative my-2 mx-0 sm:mx-2 rounded-none sm:rounded-md transition-transform transform-gpu active:scale-95 ${rootClassName}`}
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
                              onClick: (e) => onStar(e, id, isStar),
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
                              onClick: (e) => onRead(e, id, isRead),
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
                onClick={(e)=>onClick(e, id)}
            >
                {feedBodyRender()}
            </div>
        </Swipeout>
    );
};

export default React.memo(FeedItemComponent, (prevProps, props)=>{
    return (
        prevProps.id === props.id &&
        prevProps.title === props.title &&
        prevProps.summary === props.summary &&
        prevProps.thumbnailSrc === props.thumbnailSrc &&
        prevProps.sourceName === props.sourceName &&
        prevProps.sourceID === props.sourceID &&
        prevProps.sourceIcon === props.sourceIcon &&
        prevProps.publishedTime === props.publishedTime &&
        prevProps.isRead === props.isRead &&
        prevProps.isStar === props.isStar &&
        prevProps.itemIndex === props.itemIndex &&
        prevProps.isSelected === props.isSelected &&
        prevProps.className === props.className &&
        prevProps.rootClassName === props.rootClassName &&
        prevProps.itemClassName === props.itemClassName &&
        prevProps.onStar === props.onStar &&
        prevProps.onRead === props.onRead &&
        prevProps.onClick === props.onClick
    )
});
