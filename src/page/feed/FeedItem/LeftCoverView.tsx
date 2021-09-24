import React from "react";
import { Text, Stack } from "@fluentui/react";
import classnames from "classnames";
import { default as Thumbnail } from "./Thumbnail";
import FeedSwipeout from "./FeedSwipeout";
import { FeedItemViewProps } from "./type";

const LeftCoverView = ({
    id,
    title,
    thumbnailSrc,
    sourceName,
    relativePublishedTime,
    isRead,
    isStar,
    rootClassName,
    contentClassName,
    containerClassName,
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
                <Stack horizontal className="w-full space-x-4">
                    <Thumbnail
                        className={isRead ? "opacity-40" : ""}
                        thumbnailSrc={thumbnailSrc}
                    />
                    <Stack verticalAlign="stretch" className={contentClassName}>
                        <Stack horizontal>
                            <Text
                                className={classnames(titleClassName, "mb-4")}
                            >
                                {title}
                            </Text>
                            {markAsStarBtn}
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
                            <Text
                                className="flex-0 text-xs text-gray-500"
                                nowrap
                            >
                                {relativePublishedTime}
                            </Text>
                            {markAsReadBtn}
                        </Stack>
                    </Stack>
                </Stack>
            </div>
        </FeedSwipeout>
    );
};

export default React.memo(LeftCoverView);
