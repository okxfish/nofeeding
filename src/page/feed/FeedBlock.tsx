import React, { useRef, useCallback, useEffect } from "react";
import classnames from "classnames";
import { mergeStyleSets } from "@fluentui/react";
import { useThemeStyles } from "../../theme";
import { useWindowSize } from "react-use";
import FeedsPane from "./feedsPane";
import { useSelector } from "react-redux";
import { RootState } from "../../model";
import { ViewType } from "../../model/userInterface";
import { ScreenPosition } from "../../model/app";
import { useStreamContentQueryKey } from "./utils";

const FeedBlock = () => {
    const { contentLayer } = useThemeStyles();
    const centerScreenRef = useRef<HTMLDivElement>(null);
    const activedScreen = useSelector<RootState, any>(
        (state) => state.app.activedScreen
    );

    const { width: windowWidth } = useWindowSize();
    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );

    const streamContentQueryKey = useStreamContentQueryKey();
    const getScrollParent = useCallback(() => centerScreenRef.current, []);

    // 切换订阅源时，将滚动条滚动到最顶部
    useEffect(() => {
        const scrollParent = getScrollParent();
        if (scrollParent) {
            scrollParent.scrollTop = 0;
        }
    }, [streamContentQueryKey]);

    const feedClassNames = mergeStyleSets({
        feedContainer: [
            "fread-feed-page__main-col",
            "sm:w-112 h-full transition-all",
            "overflow-y-auto sm:overflow-y-scroll scrollbar-none sm:flex-shrink",
        ],
        screen: ["w-screen flex-shrink-0 sm:flex-shrink"],
        centerScreen: [
            "transform-gpu transition-transform duration-300",
            `${activedScreen === ScreenPosition.Center
                ? ""
                : "scale-90 shadow-xl"}`,
        ],
    });

    return (
        <div
            ref={centerScreenRef}
            className={classnames(
                contentLayer,
                feedClassNames.feedContainer,
                feedClassNames.screen,
                {
                    [feedClassNames.centerScreen]: windowWidth <= 640,
                    "sm:flex-1": viewType !== ViewType.threeway,
                }
            )}
            data-is-scrollable
        >
            <FeedsPane
                className={classnames("", {
                    "mx-auto": viewType !== ViewType.list,
                })}
                getScrollParent={getScrollParent} />
        </div>
    );
};

export default FeedBlock