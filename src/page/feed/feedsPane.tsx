import { default as React, ReactElement, useContext, useMemo } from "react";
import {
    CommandBar,
    ContextualMenuItemType,
    ICommandBarItemProps,
    Icon,
    IconButton,
    IContextualMenuItem,
    IContextualMenuProps,
    NeutralColors,
    Stack,
    Text,
} from "@fluentui/react";
import produce from "immer";
import api from "../../api";
import queryString from "query-string";
import { useQueryClient, useMutation, useIsFetching } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { FeedContext } from "../../context";

import FeedPaneComponent from "./feedPaneComponent";
import { get } from "lodash";
import { getTagNameFromId } from "./overviewPane";
import { useWindowSize } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../model";
import {
    FeedThumbnailDisplayType,
    FeedView,
    ViewType,
} from "../../model/userInterface";
import { ModalKeys } from "../../model/globalModal";
import { ScreenPosition } from "../../model/app";
import { Subscription } from "../../api/mockData";
import { FeedItem } from "./types";
import MenuItem from "../../component/menuItem";
import { useTranslation } from "react-i18next";

export interface Props {
    className?: string;
    getScrollParent(): any;
}

const FeedsPane = ({ className, getScrollParent }: Props) => {
    const { streamContentQuery, streamContentData } = useContext(FeedContext);

    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );
    const unreadOnly = useSelector<RootState, any>(
        (state) => state.feed.unreadOnly
    );
    const feedThumbnailDisplayType = useSelector<RootState, any>(
        (state) => state.userInterface.feedThumbnailDisplayType
    );
    const feedView = useSelector<RootState, any>(
        (state) => state.userInterface.feedView
    );

    const dispatch = useDispatch<Dispatch>();

    const history = useHistory();
    const queryClient = useQueryClient();
    const { width: windowWidth } = useWindowSize();
    const { t } = useTranslation(["translation", "viewSettings"]);

    const location = useLocation();
    const { streamId } = queryString.parse(location.search);

    const streamContentQueryKey = useMemo(
        () => ["feed/streamContentQuery", streamId, unreadOnly],
        [streamId, unreadOnly]
    );

    const markAllAsReadMutation = useMutation(
        async (streamId: string) => {
            return api.inoreader.markAllAsRead(streamId);
        },
        {
            onSuccess: () => {
                queryClient.setQueryData(
                    streamContentQueryKey,
                    produce((data) => {
                        if (
                            typeof data === "undefined" ||
                            !Array.isArray(data.pages)
                        ) {
                            return null;
                        }

                        for (const page of data.pages) {
                            if (page.entities.article) {
                                for (const id of page.result) {
                                    if (!page.entities.article[id].isRead) {
                                        page.entities.article[id].isRead = true;
                                    }
                                }
                            }
                        }
                    })
                );
            },
        }
    );

    const isFeedFetching = useIsFetching(streamContentQueryKey);

    const getThumbnailSwitchMenuItemProps = (
        key: FeedThumbnailDisplayType,
        text?: string,
        iconName?: string
    ): IContextualMenuItem => ({
        key,
        onRenderContent: () => (
            <MenuItem
                text={text}
                iconName={iconName}
                suffixRender={() => (
                    <Icon
                        iconName={
                            feedThumbnailDisplayType === key
                                ? "RadioBtnOn"
                                : "RadioBtnOff"
                        }
                    />
                )}
            />
        ),
        onClick: () => dispatch.userInterface.changeThumbnailDisplayType(key),
    });

    const getViewTypeMenuItemProps = (
        key: ViewType,
        text?: string,
        iconName?: string
    ): IContextualMenuItem => ({
        key,
        onRenderContent: () => (
            <MenuItem
                text={text}
                iconName={iconName}
                suffixRender={() => (
                    <Icon
                        iconName={
                            viewType === key ? "RadioBtnOn" : "RadioBtnOff"
                        }
                    />
                )}
            />
        ),
        onClick: (): void => dispatch.userInterface.changeViewType(key),
    });

    const getFeedViewMenuItemProps = (
        key: FeedView,
        text?: string,
        iconName?: string
    ): IContextualMenuItem => ({
        key,
        onRenderContent: () => (
            <MenuItem
                text={text}
                iconName={iconName}
                suffixRender={() => (
                    <Icon
                        iconName={
                            feedView === key ? "RadioBtnOn" : "RadioBtnOff"
                        }
                    />
                )}
            />
        ),
        onClick: (): void => dispatch.userInterface.changeFeedView(key),
    });

    const baseMenuItems: IContextualMenuItem[] = [
        {
            key: "ThemeHeader",
            itemType: ContextualMenuItemType.Header,
            onRenderIcon: () => null,
            text: t("theme"),
        },
        {
            key: "Theme",
            onRenderContent: () => {
                return (
                    <div className="flex space-x-2">
                        <IconButton
                            iconProps={{ iconName: "ClearNight" }}
                            styles={{
                                root: ["w-6 h-6 rounded-full border text-sm", {
                                    border: '1px solid currentColor'
                                    // color: NeutralColors.white,
                                }]
                            }}
                            onClick={() =>
                                dispatch.userInterface.changeToDarkTheme()
                            }
                        />
                        <IconButton
                            iconProps={{ iconName: "Sunny" }}
                            styles={{
                                root: ["w-6 h-6 rounded-full border text-sm", {
                                    border: '1px solid currentColor'
                                    // backgroundColor: NeutralColors.white,
                                    // color: NeutralColors.black,
                                }]
                            }}
                            onClick={() =>
                                dispatch.userInterface.changeToLightTheme()
                            }
                            
                        />
                    </div>
                );
            },
        },
        {
            key: "Filter",
            itemType: ContextualMenuItemType.Header,
            onRenderIcon: () => null,
            text: t("filter"),
        },
        {
            key: "UnreadOnly",
            onRenderContent: () => (
                <MenuItem
                    text={t('unread only')}
                    iconName="InboxCheck"
                    suffixRender={() => (
                        <Icon
                            iconName={unreadOnly ? "RadioBtnOn" : "RadioBtnOff"}
                        />
                    )}
                />
            ),
            onClick: () => dispatch.feed.toggleIsUnreadOnly(),
        },
        {
            key: "FeedItemStyle",
            itemType: ContextualMenuItemType.Header,
            onRenderIcon: () => null,
            text: t("viewSettings:feeditem style"),
        },
        getFeedViewMenuItemProps(
            FeedView.LeftCover,
            t("viewSettings:cover in left"),
            "ThumbnailView"
        ),
        getFeedViewMenuItemProps(
            FeedView.RightCover,
            t("viewSettings:cover in right"),
            "ThumbnailViewMirrored"
        ),
        getFeedViewMenuItemProps(
            FeedView.SocialMedia,
            t("viewSettings:social media"),
            "ButtonControl"
        ),
    ];

    const getThumbnailMenuItems = (): IContextualMenuItem[] => {
        if (viewType === ViewType.list) return [];
        return [
            {
                key: "Thumbnail",
                itemType: ContextualMenuItemType.Header,
                onRenderIcon: () => null,
                text: t("viewSettings:thumbnail display"),
            },
            getThumbnailSwitchMenuItemProps(
                FeedThumbnailDisplayType.alwaysDisplay,
                t("always"),
                "Photo2"
            ),
            getThumbnailSwitchMenuItemProps(
                FeedThumbnailDisplayType.alwaysNotDisplay,
                t("never"),
                "Photo2Remove"
            ),
            getThumbnailSwitchMenuItemProps(
                FeedThumbnailDisplayType.displayWhenThumbnaillExist,
                t("auto"),
                "PictureStretch"
            ),
        ];
    };

    const getViewTypeMenuItems = (): IContextualMenuItem[] => {
        if (windowWidth <= 640) return [];

        return [
            {
                key: "Layout",
                itemType: ContextualMenuItemType.Header,
                onRenderIcon: () => null,
                text: t("layout"),
            },
            getViewTypeMenuItemProps(
                ViewType.magazine,
                t("viewSettings:magazine view"),
                "GridViewMedium"
            ),
            getViewTypeMenuItemProps(
                ViewType.list,
                t("viewSettings:list view"),
                "GroupedList"
            ),
            getViewTypeMenuItemProps(
                ViewType.threeway,
                t("viewSettings:split view"),
                "ColumnRightTwoThirds"
            ),
        ];
    };

    const menuProps: IContextualMenuProps = {
        alignTargetEdge: true,
        items: baseMenuItems.concat(
            getThumbnailMenuItems(),
            getViewTypeMenuItems()
        ),
    };

    const handleSyncClick = () => {
        queryClient.refetchQueries(streamContentQueryKey);
    };

    const overflowItems: ICommandBarItemProps[] = [];
    const commandItems: ICommandBarItemProps[] = [
        {
            key: "sync",
            iconOnly: true,
            iconProps: { iconName: "Sync" },
            buttonStyles: {
                icon: isFeedFetching ? "fr-spin" : "",
            },
            disabled: !!isFeedFetching,
            onClick: handleSyncClick,
        },
        {
            key: "view",
            iconOnly: true,
            iconProps: { iconName: "View" },
            subMenuProps: windowWidth <= 640 ? undefined : menuProps,
            onClick: () =>
                dispatch.globalModal.openModal(ModalKeys.ViewSettingPane),
        },
    ];

    if (windowWidth <= 640) {
        commandItems.push({
            key: "settings",
            iconOnly: true,
            iconProps: { iconName: "Settings" },
            onClick: () => history.push("/settings"),
        });
    }

    const subscriptionsList = queryClient.getQueryData(
        "home/subscriptionsListQuery"
    );

    const getSubscriptionById = (id: any): Subscription =>
        get(subscriptionsList, `entities.subscription['${id}']`);

    const subscription = getSubscriptionById(streamId);

    const getFolderName = ():string => {
        if(!streamId) return t("all article");
        if(typeof streamId === "string"){
            const tagName = getTagNameFromId(streamId)
            if(tagName === 'starred') {
                return t("stared article");
            } else {
                return tagName;
            }
        } else {
            return ''
        }
    }

    const name = subscription ? subscription.title : getFolderName();

    const getFeedItems = (): FeedItem[] => {
        return streamContentData.map((item) => ({
            ...item,
            sourceIcon: getSubscriptionById(item.sourceID)?.iconUrl,
        }));
    };

    return (
        <>
            <Stack
                className="px-3 sm:px-6 py-2 sticky top-0 z-10"
                horizontal
                verticalAlign="center"
                style={{ backgroundColor: "inherit" }}
            >
                <IconButton
                    className="sm:hidden mr-2"
                    onClick={() =>
                        dispatch.app.changeActivedScreen(ScreenPosition.Left)
                    }
                    iconProps={{ iconName: "GlobalNavButton" }}
                />
                <Text className="text-xl font-semibold flex-1" block nowrap>
                    {name}
                </Text>
                <CommandBar
                    className="flex flex-1 justify-end p-0"
                    styles={{ root: "p-0" }}
                    items={commandItems}
                    overflowItems={overflowItems}
                />
            </Stack>
            <FeedPaneComponent
                className={className}
                items={getFeedItems()}
                hasNextPage={streamContentQuery.hasNextPage}
                isFetching={streamContentQuery.isFetching}
                fetchNextPage={streamContentQuery.fetchNextPage}
                getScrollParent={getScrollParent}
            />
        </>
    );
};

export default React.memo(FeedsPane);
