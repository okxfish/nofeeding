import { useRef, useCallback, useEffect, useContext } from "react";
import classnames from "classnames";
import { mergeStyleSets } from "@fluentui/react";
import { useThemeStyles } from "../../../theme";
import { useWindowSize } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { FeedContext } from "../../../context";
import { Dispatch, RootState } from "../../../model";
import { ViewType } from "../../../model/userInterface";
import { ScreenPosition } from "../../../model/app";
import FeedsPaneHeader from "./feedsPaneHeader";
import FeedList from "./feedList";
import ViewSettingPane from "./viewSettingPane";
import HelfScreenPanel from "../../../component/halfScreenPanel/halfScreenPanel";
import { ModalKeys } from "../../../model/globalModal";

const FeedPane = () => {
    const { contentLayer } = useThemeStyles();
    const scrollableAreaRef = useRef<HTMLDivElement>(null);
    const activedScreen = useSelector<RootState, any>(
        (state) => state.app.activedScreen
    );

    const dispatch = useDispatch<Dispatch>();

    const { width: windowWidth } = useWindowSize();

    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );

    const isViewSettingPaneOpened = useSelector<RootState, any>(
        (state) => state.globalModal[ModalKeys.ViewSettingPane]
    );

    const { streamContentQueryKey } = useContext(FeedContext);

    const getScrollParent = useCallback(() => scrollableAreaRef.current, []);

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
            `${
                activedScreen === ScreenPosition.Center
                    ? ""
                    : "scale-90 shadow-xl"
            }`,
        ],
    });

    return (
        <div
            ref={scrollableAreaRef}
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
            <FeedsPaneHeader />
            <FeedList
                className={classnames("", {
                    "mx-auto": viewType !== ViewType.list,
                })}
                getScrollParent={getScrollParent}
            />
            <HelfScreenPanel
                isOpen={isViewSettingPaneOpened}
                isLightDismiss
                hasCloseButton={false}
                onDismiss={() =>
                    dispatch.globalModal.closeModal(ModalKeys.ViewSettingPane)
                }
                onLightDismissClick={() =>
                    dispatch.globalModal.closeModal(ModalKeys.ViewSettingPane)
                }
            >
                <ViewSettingPane />
            </HelfScreenPanel>
        </div>
    );
};

export default FeedPane;
