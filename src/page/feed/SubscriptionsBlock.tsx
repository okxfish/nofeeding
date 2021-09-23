import React from "react";
import classnames from "classnames";
import { mergeStyleSets, useTheme } from "@fluentui/react";
import { useWindowSize } from "react-use";
import { default as OverviewPane } from "./SubscriptionsPane";
import { useSelector } from "react-redux";
import { RootState } from "../../model";
import { ScreenPosition } from "../../model/app";

const SubscriptionsBlock = () => {
    const isOverviewPaneOpen = useSelector<RootState, any>(
        (state) => state.app.isOverviewPaneOpen
    );

    const activedScreen = useSelector<RootState, any>(
        (state) => state.app.activedScreen
    );

    const { width: windowWidth } = useWindowSize();
    const { palette } = useTheme();

    const feedClassNames = mergeStyleSets({
        overviewContainer: [
            "transform-gpu origin-left duration-300",
            "scrollbar-none overflow-y-auto sm:overflow-y-scroll",
            "px-2 transition-all",
            "sm:block sm:w-nav-pane",
            {
                backgroundColor: palette.neutralLight,
            },
        ],
        screen: ["w-screen flex-shrink-0 sm:flex-shrink"],
        leftScreen: [
            "h-screen absolute top-0 z-30",
            "left-0",
            "transform-gpu transition-transform duration-300",
            `${activedScreen === ScreenPosition.Left ? "" : "-translate-x-full"}`,
        ],
    });

    return (
        <div
            className={classnames(
                feedClassNames.overviewContainer,
                feedClassNames.screen,
                {
                    [feedClassNames.leftScreen]: windowWidth <= 640,
                    "sm:-ml-64 sm:scale-90": !isOverviewPaneOpen,
                }
            )}
        >
            <OverviewPane />
        </div>
    );
};

export default React.memo(SubscriptionsBlock)