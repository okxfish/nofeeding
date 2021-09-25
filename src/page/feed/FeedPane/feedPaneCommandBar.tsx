import { default as React, useMemo } from "react";
import {
    CommandBar,
    ContextualMenuItemType,
    ICommandBarItemProps,
    Icon,
    IconButton,
    IContextualMenuItem,
    IContextualMenuProps,
} from "@fluentui/react";
import produce from "immer";
import api from "../../../api";
import { useQueryClient, useMutation, useIsFetching } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dispatch, RootState } from "../../../model";
import {
    FeedThumbnailDisplayType,
    FeedView,
    ViewType,
} from "../../../model/userInterface";
import { ModalKeys } from "../../../model/globalModal";
import MenuItem from "../../../component/menuItem";

export interface Props {
    className?: string;
    getScrollParent(): any;
}

const FeedPaneCommandBar = () => {
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
    const userId = useSelector<RootState, any>(
        (state) => state.userInfo.userId
    );

    const dispatch = useDispatch<Dispatch>();

    const history = useHistory();
    const queryClient = useQueryClient();
    const { width: windowWidth } = useWindowSize();
    const { t } = useTranslation(["translation", "viewSettings"]);

    const routeParams = useParams<{ streamId: string }>();
    const streamId = routeParams.streamId
        ? decodeURIComponent(routeParams.streamId)
        : `user/${userId}/state/com.google/root`;

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
                                root: [
                                    "w-6 h-6 rounded-full border text-sm",
                                    {
                                        border: "1px solid currentColor",
                                        // color: NeutralColors.white,
                                    },
                                ],
                            }}
                            onClick={() =>
                                dispatch.userInterface.changeToDarkTheme()
                            }
                        />
                        <IconButton
                            iconProps={{ iconName: "Sunny" }}
                            styles={{
                                root: [
                                    "w-6 h-6 rounded-full border text-sm",
                                    {
                                        border: "1px solid currentColor",
                                    },
                                ],
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
                    text={t("unread only")}
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

    return (
        <CommandBar
            className="flex flex-1 justify-end p-0"
            styles={{ root: "p-0" }}
            items={commandItems}
            overflowItems={overflowItems}
        />
    );
};

export default React.memo(FeedPaneCommandBar);
