import React from "react";
import { Text, Stack } from "@fluentui/react";
import classnames from "classnames";
import { FeedItemViewProps } from "./type";

const SingleLineView = ({
    id,
    title,
    sourceName,
    relativePublishedTime,
    isRead,
    rootClassName,
    contentClassName,
    containerClassName,
    titleClassName,
    markAsReadBtn,
    markAsStarBtn,
    onClick,
}: FeedItemViewProps) => {
    return (
        <div
            className={`relative my-2 mx-0 sm:mx-2 rounded-none sm:rounded-md ${rootClassName}`}
        >
            <div
                className={classnames(containerClassName, "py-1")}
                onClick={(e) => onClick(e, id)}
            >
                <Stack
                    horizontal
                    verticalAlign="center"
                    className={classnames(contentClassName)}
                >
                    {markAsStarBtn}
                    <Text className={classnames(titleClassName, "mr-2")}>
                        {title}
                    </Text>
                    <Stack
                        className="space-x-2"
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
                    {markAsReadBtn}
                </Stack>
            </div>
        </div>
    );
};

export default React.memo(SingleLineView);
