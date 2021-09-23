import { normalize, NormalizedSchema, schema } from "normalizr";
import { FeedItem, FeedProps } from "./types";
import { useCallback, useMemo } from "react";
import { useInfiniteQuery, UseInfiniteQueryResult, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "../../model";
import { get } from "lodash";
import { default as api } from "../../api";
import { StreamContentsResponse, SystemStreamIDs } from "../../api/inoreader";
import { Dayjs, default as dayjs } from "dayjs";
import produce from "immer";
import { usePrevious } from "react-use";

const article = new schema.Entity<FeedProps>("article");
interface ArticleEntitySchema {
    article: {
        [key: string]: any;
    };
}

export const filterImgSrcfromHtmlStr = (htmlStr: string): string => {
    let result = "";
    const imgReg = /<img.*?(?:>|\/>)/i;
    const srcReg = /src=['"]?([^'"]*)['"]?/i;
    const imgs = htmlStr.match(imgReg);

    if (Array.isArray(imgs) && imgs.length > 0) {
        const srcResult = imgs[0].match(srcReg);
        if (srcResult !== null) {
            result = srcResult[1];
        }
    }
    return result;
};

export interface InfiniteNormalizedArticles
    extends NormalizedSchema<ArticleEntitySchema, string[]> {
    continuation: string;
}

export const useStreamContentQueryKey = () => {
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

    return streamContentQuery
}

export const useStreamContent = ():{
    streamContentData?: any[];
    streamContentQuery?: UseInfiniteQueryResult<InfiniteNormalizedArticles, unknown>;
    setArticleDataById(id:string, updater:any): void;
    getArticleDataById(id:string): FeedItem | null;    
} => {
    const streamContentQueryKey = useStreamContentQueryKey()

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

    const getArticleDataById = useCallback((id: string):null | FeedItem => {
        const { data } = streamContentQuery;
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
    },[streamContentQuery.data])
    
    const setArticleDataById = useCallback(
        (id, updater) => {
            queryClient.setQueryData(
                streamContentQueryKey,
                produce((data) => {
                    const article = getArticleDataById(id);
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
};
