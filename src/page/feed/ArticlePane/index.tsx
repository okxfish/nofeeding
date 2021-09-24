import { 
    useRef,
    useMemo,
    useEffect,
    useContext,
    ReactElement
} from "react";
import classnames from "classnames";
import { FeedItem } from "../types";
import { Modal, mergeStyleSets } from "@fluentui/react";
import { ArticleContext, SetFeedItemContext } from "../../../context";
import { useThemeStyles } from "../../../theme";
import { useParams, useHistory } from "react-router-dom";
import { usePrevious, useWindowSize } from "react-use";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Dispatch } from "../../../model";
import { ModalKeys } from "../../../model/globalModal";
import { ViewType } from "../../../model/userInterface";
import { ScreenPosition } from "../../../model/app";
import ArticlePaneInner from "./articlePaneInner";
import "./style.css";

const ArticlePane = () => {
    const { getArticleDataById } = useContext(SetFeedItemContext);
    const isArticleModalOpen = useSelector<RootState, any>(
        (state) => state.globalModal[ModalKeys.ArticleModal]
    );
    const activedScreen = useSelector<RootState, any>(
        (state) => state.app.activedScreen
    );
    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );
    const dispatch = useDispatch<Dispatch>();
    const history = useHistory();
    const { width: windowWidth } = useWindowSize();
    const { contentLayer } = useThemeStyles();
    const routeParams = useParams<{ streamId: string; articleId: string }>();
    const articleId = routeParams.articleId
        ? decodeURIComponent(routeParams.articleId)
        : "";

    const notEmptyPrevArticleIdRef = useRef<string>("");

    // 切换订阅源时，将滚动条滚动到最顶部
    useEffect(() => {
        if (articleId) {
            if (articleId !== notEmptyPrevArticleIdRef.current) {
                notEmptyPrevArticleIdRef.current = articleId;
            }
        }
    }, [articleId]);

    const prevArticleId = usePrevious(articleId);

    // 根据 prevArticleId 和 articleId 判断打开或关闭文章
    useEffect(() => {
        const openArticle = () => {
            if (windowWidth <= 640) {
                dispatch.app.changeActivedScreen(ScreenPosition.Right);
            } else if (viewType !== ViewType.threeway) {
                dispatch.globalModal.openModal(ModalKeys.ArticleModal);
            }
        };

        const closeArticle = () => {
            if (windowWidth <= 640) {
                dispatch.app.changeActivedScreen(ScreenPosition.Center);
            } else if (viewType !== ViewType.threeway) {
                dispatch.globalModal.closeModal(ModalKeys.ArticleModal);
            }
        };

        if (articleId !== prevArticleId) {
            if (articleId) {
                openArticle();
            } else {
                closeArticle();
            }
        }
    }, [articleId, prevArticleId, windowWidth, viewType]);

    // 如果当前 articleId 为空，则文章内容不改变
    const activedArticle = useMemo<FeedItem | null>(() => {
        let id = articleId;
        if (!articleId) {
            id = notEmptyPrevArticleIdRef.current;
        }
        return getArticleDataById(id);
    }, [articleId]);

    const feedClassNames = mergeStyleSets({
        articleContainer: ["sm:border-none"],
        screen: ["w-screen flex-shrink-0 sm:flex-shrink"],
        righttScreen: [
            "h-screen absolute top-0 z-30",
            "left-full",
            "transform-gpu transition-transform duration-300",
            `${
                activedScreen === ScreenPosition.Right
                    ? "-translate-x-full"
                    : ""
            }`,
        ],
    });

    const articlePaneRender = (): ReactElement | null => {
        if (viewType === ViewType.threeway) {
            return (
                <div
                    className={classnames("flex-1", contentLayer)}
                    style={{ minWidth: "32rem" }}
                >
                    <ArticlePaneInner className="h-full" />
                </div>
            );
        } else if (windowWidth <= 640) {
            return (
                <div
                    className={classnames(
                        contentLayer,
                        feedClassNames.articleContainer,
                        feedClassNames.screen,
                        feedClassNames.righttScreen
                    )}
                >
                    <ArticlePaneInner
                        className="h-full"
                        closeModal={() => history.goBack()}
                    />
                </div>
            );
        } else {
            return (
                <Modal
                    className=""
                    isOpen={isArticleModalOpen}
                    onDismiss={() => history.goBack()}
                    isBlocking={false}
                    allowTouchBodyScroll
                >
                    <ArticlePaneInner
                        className="sm:max-w-3xl sm:h-90vh w-screen"
                        closeModal={() => history.goBack()}
                    />
                </Modal>
            );
        }
    };

    return (
        <ArticleContext.Provider value={activedArticle}>
            {articlePaneRender()}
        </ArticleContext.Provider>
    );
};

export default ArticlePane;
