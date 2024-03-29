import { ReactNode, useCallback, useMemo } from "react";
import produce from "immer";
import { normalize, NormalizedSchema, schema } from "normalizr";
import { FeedContext, SetFeedItemContext } from "../../../context";
import { FeedItem, FeedProps } from "../types";
import {
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useQueryClient,
} from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "../../../model";
import { get } from "lodash";
import { default as api } from "../../../api";
import {
    StreamContentsResponse,
    SystemStreamIDs,
} from "../../../api/inoreader";
import { Dayjs, default as dayjs } from "dayjs";
import { filterImgSrcfromHtmlStr } from "../utils";

const StreamContentContainer = ({ children }: { children: ReactNode }) => {
    const streamContentQueryKey = useStreamContentQueryKey();
    const {
        streamContentData,
        streamContentQuery,
        setArticleDataById,
        getArticleDataById,
    } = useStreamContent();

    return (
        <FeedContext.Provider
            value={{
                streamContentQuery,
                streamContentData,
                streamContentQueryKey,
            }}
        >
            <SetFeedItemContext.Provider
                value={{
                    getArticleDataById,
                    setArticleDataById,
                }}
            >
                {children}
            </SetFeedItemContext.Provider>
        </FeedContext.Provider>
    );
};

interface InfiniteNormalizedArticles
    extends NormalizedSchema<ArticleEntitySchema, string[]> {
    continuation: string;
}

interface ArticleEntitySchema {
    article: {
        [key: string]: any;
    };
}

const article = new schema.Entity<FeedProps>("article");

function useStreamContentQueryKey(): any[] {
    const unreadOnly = useSelector<RootState, any>(
        (state) => state.feed.unreadOnly
    );

    const userInfo = useSelector<RootState, any>((state) => state.userInfo);

    const routeParams = useParams<{ streamId: string; articleId: string }>();

    const streamId = routeParams.streamId
        ? decodeURIComponent(routeParams.streamId)
        : `user/${userInfo?.userId}/state/com.google/root`;

    const streamContentQuery = useMemo(
        () => ["feed/streamContentQuery", streamId, unreadOnly],
        [streamId, unreadOnly]
    );

    return streamContentQuery;
}

function useStreamContent(): {
    streamContentData?: any[];
    streamContentQuery?: UseInfiniteQueryResult<
        InfiniteNormalizedArticles,
        unknown
    >;
    setArticleDataById(id: string, updater: any): void;
    getArticleDataById(id: string): FeedItem | null;
} {
    const streamContentQueryKey = useStreamContentQueryKey();

    const queryClient = useQueryClient();

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

    const _getArticleDataById = (
        id: string,
        data?: { pages: InfiniteNormalizedArticles[] }
    ): null | FeedItem => {
        if (typeof data === "undefined") {
            return null;
        }

        const pageResult = data.pages.find((page) => {
            return id in page.entities.article;
        });

        if (pageResult) {
            return pageResult.entities.article[id];
        } else {
            return null;
        }
    };

    const getArticleDataById = useCallback(
        (id: string) => _getArticleDataById(id, streamContentQuery.data),
        [streamContentQuery.data]
    );

    const setArticleDataById = useCallback(
        (id: string, updater: any) => {
            queryClient.setQueryData(
                streamContentQueryKey,
                produce((data) => {
                    const article = _getArticleDataById(id, data);
                    if (article) {
                        updater(article);
                    }
                })
            );
        },
        [queryClient, streamContentQueryKey]
    );

    const subscriptionsList = queryClient.getQueryData(
        "home/subscriptionsListQuery"
    );

    const streamContentData = useMemo(() => {
        if (streamContentQuery.data) {
            return streamContentQuery.data.pages
                .map((pages, index) => {
                    const {
                        entities: { article },
                        result,
                    } = pages;
                    return result.map((id) => {
                        const item = article[id];
                        return {
                            ...item,
                            sourceIcon: get(
                                subscriptionsList,
                                `entities.subscription['${item.sourceID}'].iconUrl`
                            ),
                        };
                    });
                })
                .reduce((acc, cur) => [...acc, ...cur], []);
        }
    }, [streamContentQuery.data, subscriptionsList]);

    return {
        streamContentData,
        streamContentQuery,
        setArticleDataById,
        getArticleDataById,
    };
}

export { StreamContentContainer as default };
