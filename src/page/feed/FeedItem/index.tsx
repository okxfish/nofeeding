import React from "react";
import {
    IIconProps,
    useTheme,
    mergeStyleSets,
    IconButton,
} from "@fluentui/react";
import { FeedProps } from "../types";
import { default as dayjs, Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../model";
import { FeedView, ViewType } from "../../../model/userInterface";
import SingleLineView from "./SingleLineView";
import RightCoverView from "./RightCoverView";
import SocialMediaView from "./SocialMediaView";
import LeftCoverView from "./LeftCoverView";

export interface Props extends FeedProps {
    itemIndex: number;
    isSelected?: boolean;
    sourceIcon?: string;
    onStar(e: any, id: string, isStar?: boolean): void;
    onRead(e: any, id: string, isRead?: boolean): void;
    onClick(e: any, id: string): void;
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

    const { palette } = useTheme();

    const classNames = mergeStyleSets({
        container: [
            "relative z-10 group cursor-pointer px-4",
            {
                selectors: {
                    "&:hover": {
                        backgroundColor: palette.neutralLight,
                    },
                },
            },
        ],
        content: ["flex-1 overflow-hidden", isRead ? "opacity-40" : ""],
        title: ["text-base truncat-3 flex-1"],
    });

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

    const markAsStarCommonProps = {
        iconProps: isStar ? favoriteStarFillIcon : favoriteStarIcon,
        onClick: (e) => onStar(e, id, isStar),
        styles: iconBtnStyle,
    };

    const viewProps = {
        id,
        title,
        thumbnailSrc,
        sourceName,
        sourceIcon,
        publishedTime,
        isRead,
        isStar,
        itemClassName,
        onStar,
        onRead,
        onClick,
        relativePublishedTime,
        containerClassName: classNames.container,
        contentClassName: classNames.content,
        titleClassName: classNames.title,
        markAsReadBtn: <IconButton {...markAsReadCommonProps} />,
        markAsStarBtn: <IconButton {...markAsStarCommonProps} />,
    };

    const rootClassName =
        "relative my-2 mx-0 sm:mx-2 rounded-none sm:rounded-md";

    const activedClassName =
        "transition-transform transform-gpu active:scale-95";

    if (viewType === ViewType.list) {
        return (
            <SingleLineView {...viewProps} rootClassName={`${rootClassName}`} />
        );
    } else {
        if (feedView === FeedView.RightCover) {
            return (
                <RightCoverView
                    {...viewProps}
                    rootClassName={`${rootClassName} ${activedClassName}`}
                />
            );
        } else if (feedView === FeedView.SocialMedia) {
            return (
                <SocialMediaView
                    {...viewProps}
                    rootClassName={`${rootClassName} ${activedClassName}`}
                />
            );
        } else {
            return (
                <LeftCoverView
                    {...viewProps}
                    rootClassName={`${rootClassName} ${activedClassName}`}
                />
            );
        }
    }
};

export default React.memo(FeedItemComponent);
