import React from "react";
import { Text, Stack } from "@fluentui/react";
import classnames from "classnames";
import { FeedItemViewProps } from "./type";
import Thumbnail from "./Thumbnail";
import FeedSwipeout from "./FeedSwipeout";

const SocialMediaView = ({
    id,
    title,
    thumbnailSrc,
    sourceName,
    sourceIcon,
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
                <Stack
                    verticalAlign="stretch"
                    horizontal
                    className={classnames(contentClassName, "space-x-4")}
                >
                    <img
                        src={sourceIcon}
                        className="w-8 h-8 rounded-full flex-0"
                    />
                    <Stack
                        horizontalAlign="stretch"
                        className="space-y-2 flex-1"
                    >
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
                        <Text className={titleClassName}>{title}</Text>
                        <Thumbnail
                            className={classnames(
                                "w-full h-auto max-h-sm max-w-lg",
                                { "opacity-40": isRead }
                            )}
                            thumbnailSrc={thumbnailSrc}
                        />
                        <Stack
                            horizontal
                            verticalAlign="center"
                            horizontalAlign="space-between"
                        >
                            {markAsStarBtn}
                            {markAsReadBtn}
                        </Stack>
                    </Stack>
                </Stack>
            </div>
        </FeedSwipeout>
    );
};

export default React.memo(SocialMediaView);
