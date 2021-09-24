import React from "react";
import classnames from "classnames";
import { Text, Stack } from "@fluentui/react";
import Thumbnail from "./Thumbnail";
import FeedSwipeout from "./FeedSwipeout";
import { FeedItemViewProps } from "./type";

const RightCoverView = ({
    id,
    title,
    thumbnailSrc,
    sourceName,
    relativePublishedTime,
    isRead,
    isStar,
    rootClassName,
    containerClassName,
    contentClassName,
    titleClassName,
    onStar,
    onRead,
    onClick,
    markAsReadBtn,
    markAsStarBtn,
}: FeedItemViewProps) => {
    return (
        <FeedSwipeout
            className={`${rootClassName}`}
            id={id}
            isStar={isStar}
            isRead={isRead}
            onRead={onRead}
            onStar={onStar}
        >
            <div
                className={classnames(containerClassName, "py-3")}
                onClick={(e) => onClick(e, id)}
            >
                <Stack verticalAlign="stretch" className={contentClassName}>
                    <Stack
                        horizontal
                        verticalAlign="stretch"
                        className="mb-3 space-x-4"
                    >
                        <Text className={titleClassName}>{title}</Text>
                        <Thumbnail
                            className={isRead ? "opacity-40" : ""}
                            thumbnailSrc={thumbnailSrc}
                        />
                    </Stack>
                    <Stack
                        horizontal
                        verticalAlign="center"
                        className="space-x-2"
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
                        <div className="flex-1" />
                        {markAsStarBtn}
                        {markAsReadBtn}
                    </Stack>
                </Stack>
            </div>
        </FeedSwipeout>
    );
};

export default React.memo(RightCoverView);
