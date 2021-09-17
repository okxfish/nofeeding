import React, {
    useRef,
    useMemo,
    useCallback,
    Suspense,
    ReactElement,
} from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { FeedItem, FeedProps } from "./types";
import { filterImgSrcfromHtmlStr } from "./utils";
import { default as api } from "../../api";
import { StreamContentsResponse, SystemStreamIDs } from "../../api/inoreader";
import { normalize, NormalizedSchema, schema } from "normalizr";
import { Dayjs, default as dayjs } from "dayjs";
import classnames from "classnames";
import {
    Modal,
    mergeStyleSets,
    useTheme,
} from "@fluentui/react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { produce } from "immer";
import {
    FeedContext,
    SetFeedItemContext,
    ArticleContext,
} from "./../../context";
import { useThemeStyles } from "../../theme";
import { useWindowSize } from "react-use";

import ArticlePane from "./articlePane";
import FeedsPane from "./feedsPane";
import OverviewPane from "./overviewPane";

import { useSelector, useDispatch } from "react-redux";
import { RootState, Dispatch } from "../../model";
import { ModalKeys } from "../../model/globalModal";
import { ViewType } from "../../model/userInterface";
import { ScreenPosition } from "../../model/app";
import "./style.css";

const article = new schema.Entity<FeedProps>("article");
interface ArticleEntitySchema {
    article: {
        [key: string]: any;
    };
}

interface InfiniteNormalizedArticles
    extends NormalizedSchema<ArticleEntitySchema, string[]> {
    continuation: string;
}

interface Props {}

const FeedContainer = ({}: Props) => {
    const isArticleModalOpen = useSelector<RootState, any>(
        (state) => state.globalModal[ModalKeys.ArticleModal]
    );
    const isOverviewPaneOpen = useSelector<RootState, any>(
        (state) => state.app.isOverviewPaneOpen
    );
    const activedScreen = useSelector<RootState, any>(
        (state) => state.app.activedScreen
    );
    const currenActivedFeedId = useSelector<RootState, any>(
        (state) => state.app.currenActivedFeedId
    );
    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );
    const unreadOnly = useSelector<RootState, any>(
        (state) => state.feed.unreadOnly
    );

    const dispatch = useDispatch<Dispatch>();

    const location = useLocation();
    const queryClient = useQueryClient();
    const qs = queryString.parse(location.search);
    const streamId = qs.streamId;
    const { width: windowWidth } = useWindowSize();
    const { contentLayer } = useThemeStyles();
    const { palette } = useTheme();

    const centerScreenRef = useRef<HTMLDivElement>(null);

    const streamContentQueryKey = useMemo(
        () => ["feed/streamContentQuery", streamId, unreadOnly],
        [streamId, unreadOnly]
    );

    const resolveResponse = (data: StreamContentsResponse): FeedItem[] => {
        return data.items.map((item, index) => {
            const publishedTime: Dayjs = dayjs.unix(item.published);
            const thumbnailSrc = filterImgSrcfromHtmlStr(item.summary.content);
            return {
                id: item.id,
                title: item.title,
                summary: "",
                thumbnailSrc: thumbnailSrc,
                content: item.summary.content,
                sourceName: item.origin.title,
                sourceID: item.origin.streamId,
                url: item.canonical[0].href,
                publishedTime: publishedTime,
                isRead: false,
                isStar: false,
                isInnerArticleShow: false,
            };
        });
    };

    // 从服务器获取 feed 流，并且将响应数据转换成组件的状态，将数据范式化
    const streamContentQuery = useInfiniteQuery<InfiniteNormalizedArticles>(
        streamContentQueryKey,
        async ({
            queryKey: [key, streamId = "", unreadOnly],
            pageParam = "",
        }): Promise<InfiniteNormalizedArticles> => {
            const exclude = unreadOnly ? SystemStreamIDs.READ : "";
            const res = await api.inoreader.getStreamContents(
                String(streamId),
                {
                    exclude: exclude,
                    continuation: pageParam,
                }
            );

            const newNormalizedArticles = normalize<any, ArticleEntitySchema>(
                resolveResponse(res.data),
                [article]
            );
            return {
                ...newNormalizedArticles,
                continuation: res.data.continuation,
            };
        },
        {
            refetchOnWindowFocus: false,
            retry: false,
            getNextPageParam: (lastPage, pages) => {
                return lastPage.continuation;
            },
        }
    );

    const getArticleById = (id: string, data: any) => {
        if (typeof data === "undefined" || !Array.isArray(data.pages)) {
            return null;
        }

        const pageResult = data.pages.find((page) => {
            if (page.entities.article) {
                return id in page.entities.article;
            } else {
                return false;
            }
        });

        if (pageResult) {
            return pageResult.entities.article[id];
        } else {
            return null;
        }
    };

    const setArticleDataById = useCallback(
        (id, updater) => {
            queryClient.setQueryData(
                streamContentQueryKey,
                produce((data) => {
                    const article = getArticleById(id, data);
                    if (article) {
                        updater(article);
                    }
                })
            );
        },
        [queryClient, streamContentQueryKey]
    );

    let streamContentData: any[] = [];

    if (streamContentQuery.data) {
        streamContentData = streamContentQuery.data.pages
            .map((pages, index) => {
                const {
                    entities: { article },
                    result,
                } = pages;
                return result.map((id) => ({
                    ...article[id],
                }));
            })
            .reduce((acc, cur) => [...acc, ...cur], []);
    }

    const activedArticle: FeedItem | null = getArticleById(
        currenActivedFeedId,
        streamContentQuery.data
    );

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
        feedContainer: [
            "fread-feed-page__main-col",
            "sm:w-112 h-full transition-all",
            "overflow-y-auto sm:overflow-y-scroll sm:scrollbar sm:flex-shrink",
        ],
        articleContainer: ["sm:border-none"],
        screen: ["w-screen flex-shrink-0 sm:flex-shrink"],
        leftScreen: [
            "h-screen absolute top-0 z-30",
            "left-0",
            "transform-gpu transition-transform duration-300",
            `${
                activedScreen === ScreenPosition.Left ? "" : "-translate-x-full"
            }`,
        ],
        centerScreen: [
            "transform-gpu transition-transform duration-300",
            `${
                activedScreen === ScreenPosition.Center
                    ? ""
                    : "scale-90 shadow-xl"
            }`,
        ],
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

    const getScrollParent = useCallback(() => centerScreenRef.current, []);

    const articlePaneRender = (): ReactElement | null => {
        if (viewType === ViewType.threeway) {
            return (
                <div
                    className={classnames("flex-1", contentLayer)}
                    style={{ minWidth: "32rem" }}
                >
                    <ArticlePane className="h-full" />
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
                    <ArticlePane
                        className="h-full"
                        closeModal={() =>
                            dispatch.app.changeActivedScreen(
                                ScreenPosition.Center
                            )
                        }
                    />
                    
                </div>
            );
        } else {
            return (
                <Modal
                    className=""
                    isOpen={isArticleModalOpen}
                    onDismiss={() =>
                        dispatch.globalModal.closeModal(ModalKeys.ArticleModal)
                    }
                    isBlocking={false}
                    allowTouchBodyScroll
                    styles={{
                        main: [
                            {
                                maxHeight: "100%",
                                maxWidth: "100%",
                            },
                        ],
                    }}
                >
                    <ArticlePane
                        className="article-modal h-screen w-screen"
                        closeModal={() =>
                            dispatch.globalModal.closeModal(
                                ModalKeys.ArticleModal
                            )
                        }
                    />
                </Modal>
            );
        }
    };

    return (
        <Suspense fallback={() => null}>
            <FeedContext.Provider
                value={{
                    streamContentQuery,
                    streamContentData,
                    streamContentQueryKey,
                }}
            >
                <SetFeedItemContext.Provider value={setArticleDataById}>
                    <ArticleContext.Provider value={activedArticle}>
                        <div
                            className={classnames(
                                feedClassNames.overviewContainer,
                                feedClassNames.screen,
                                {
                                    [feedClassNames.leftScreen]:
                                        windowWidth <= 640,
                                    "sm:-ml-64 sm:scale-90":
                                        !isOverviewPaneOpen,
                                }
                            )}
                        >
                            <OverviewPane />
                        </div>
                        <div
                            ref={centerScreenRef}
                            className={classnames(
                                contentLayer,
                                feedClassNames.feedContainer,
                                feedClassNames.screen,
                                {
                                    [feedClassNames.centerScreen]:
                                        windowWidth <= 640,
                                    "sm:flex-1": viewType !== ViewType.threeway,
                                }
                            )}
                            data-is-scrollable
                        >
                            <FeedsPane
                                className={classnames("", {
                                    "mx-auto": viewType !== ViewType.list,
                                })}
                                getScrollParent={getScrollParent}
                            />
                        </div>
                        {articlePaneRender()}
                    </ArticleContext.Provider>
                </SetFeedItemContext.Provider>
            </FeedContext.Provider>
        </Suspense>
    );
};

export default React.memo(FeedContainer);
