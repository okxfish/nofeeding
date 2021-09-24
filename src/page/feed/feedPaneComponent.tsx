import React, { useCallback, useContext } from "react";
import { FeedItem } from "./types";
import { default as FeedItemComponent} from "./FeedItem";
import InfiniteScroll from "react-infinite-scroller";
import { isEmpty } from "lodash";
import {
    Stack,
    Spinner,
    SpinnerSize,
    FontIcon,
    List,
    Text,
} from "@fluentui/react";
import FeedShimmer from "./feedShimmer";
import { SetFeedItemContext } from "./../../context";
import { useMutation } from "react-query";
import api from "../../api";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../model";

export interface Props {
    className?: string;
    items: FeedItem[];
    hasNextPage: boolean;
    isFetching: boolean;
    fetchNextPage(): any;
    getScrollParent(): any;
}

const FeedPaneComponent = ({
    className,
    items,
    hasNextPage,
    isFetching,
    fetchNextPage,
    getScrollParent,
}: Props) => {
    const { setArticleDataById } = useContext(SetFeedItemContext);
    const routeParams = useParams<{ streamId: string; articleId: string }>();
    const currenActivedFeedId = routeParams.articleId
        ? decodeURIComponent(routeParams.articleId)
        : "";
    const userInfo = useSelector<RootState, any>((state) => state.userInfo);
    const streamId = routeParams.streamId
        ? decodeURIComponent(routeParams.streamId)
        : `user/${userInfo?.userId}/state/com.google/root`;
    const history = useHistory();

    const markAboveAsReadMutation = useMutation(
        ({ ids, asUnread }: { ids: string[]; asUnread?: boolean }): any =>
            api.inoreader.markArticleAsRead(ids, asUnread),
        {
            onMutate: ({ ids, asUnread }) => {
                for (const id of ids) {
                    setArticleDataById(id, (article) => {
                        article.isRead = !asUnread;
                    });
                }
            },
            onError: (error, { ids, asUnread }) => {
                for (const id of ids) {
                    setArticleDataById(id, (article) => {
                        article.isRead = asUnread;
                    });
                }
            },
        }
    );

    const markAsReadMutation = useMutation(
        ({ id, asUnread }: { id: string; asUnread?: boolean }): any =>
            api.inoreader.markArticleAsRead(id, asUnread),
        {
            onMutate: ({ id, asUnread }) => {
                setArticleDataById(id, (article) => {
                    article.isRead = !asUnread;
                });
            },
            onError: (error, { id, asUnread }) => {
                setArticleDataById(id, (article) => {
                    article.isRead = asUnread;
                });
            },
        }
    );

    const handleOnItemClick = useCallback(
        (e, id: string) => {
            history.push({
                pathname: `/feed/${encodeURIComponent(
                    streamId
                )}/${encodeURIComponent(id)}`,
            });
            markAsReadMutation.mutate({ id, asUnread: false });
        },
        [markAsReadMutation.mutate, history.push, streamId]
    );

    const handleOnItemRead = useCallback(
        (e: any, id: string, isRead?: boolean) => {
            if (e) {
                e.stopPropagation();
            }
            markAsReadMutation.mutate({ id, asUnread: isRead });
        },
        [markAsReadMutation.mutate]
    );

    // 文章标星
    const markAsStarMutation = useMutation(
        ({ id, isStar }: { id: string; isStar?: boolean }): any =>
            api.inoreader.markArticleAsStar(id, isStar),
        {
            onMutate: ({ id, isStar }) => {
                setArticleDataById(id, (article) => {
                    article.isStar = isStar;
                });
            },
            onError: (error, { id, isStar }) => {
                setArticleDataById(id, (article) => {
                    article.isStar = !isStar;
                });
            },
        }
    );

    const handleOnItemStar = useCallback(
        (e: any, id: string, isStar?: boolean) => {
            if (e) {
                e.stopPropagation();
            }
            markAsStarMutation.mutate({ id, isStar: !isStar });
        },
        [markAsStarMutation.mutate]
    );

    const { t } = useTranslation();

    const onRenderCell = useCallback(
        (item?: FeedItem, index?: number | undefined): React.ReactNode => {
            if (typeof item === "undefined" || typeof index === "undefined") {
                return null;
            }
            return (
                <FeedItemComponent
                    {...item}
                    key={item.id}
                    itemIndex={index}
                    onStar={handleOnItemStar}
                    onRead={handleOnItemRead}
                    onClick={handleOnItemClick}
                />
            );
        },
        []
    );

    if (!isEmpty(items)) {
        return (
            <InfiniteScroll
                getScrollParent={getScrollParent}
                className={className}
                initialLoad={false}
                loadMore={fetchNextPage}
                useWindow={false}
                hasMore={hasNextPage && !isFetching}
            >
                <List<FeedItem>
                    items={items}
                    onRenderCell={onRenderCell}
                    usePageCache
                />
                <div>
                    {isFetching ? (
                        <Spinner
                            label={t("loading")}
                            size={SpinnerSize.large}
                            styles={{ root: "m-auto h-32", circle: "border-2" }}
                        />
                    ) : null}
                </div>
            </InfiniteScroll>
        );
    } else {
        if (isFetching) {
            return (
                <div className={`${className} h-full`}>
                    <FeedShimmer />
                </div>
            );
        } else {
            return (
                <Stack className="text-center p-24">
                    <FontIcon iconName="FangBody" className="text-7xl" />
                    <Text className="font-semibold text-xl">Nothing Here</Text>
                </Stack>
            );
        }
    }
};

export default React.memo(FeedPaneComponent, (prevProps, nextProps) => {
    if (
        prevProps.className !== nextProps.className ||
        prevProps.items !== nextProps.items ||
        prevProps.hasNextPage !== nextProps.hasNextPage ||
        prevProps.isFetching !== nextProps.isFetching ||
        prevProps.fetchNextPage !== nextProps.fetchNextPage ||
        prevProps.getScrollParent !== nextProps.getScrollParent
    ) {
        return false;
    } else {
        return true;
    }
});
