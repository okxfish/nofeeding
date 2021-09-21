import React, { ReactElement, useContext } from "react";
import {
    Stack,
    Text,
    INavLink,
    Nav,
    IRenderFunction,
    Icon,
    IconButton,
    INavLinkGroup,
    CommandBar,
    ICommandBarItemProps,
} from "@fluentui/react";
import { useHistory, useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";
import { get } from "lodash";
import queryString from "query-string";
import { IdValuePair, SystemStreamIDs } from "../../api/inoreader";
import { Tag } from "../../api/mockData";
import { useWindowSize } from "react-use";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Dispatch } from "../../model";
import { ModalKeys } from "../../model/globalModal";
import { ScreenPosition } from "../../model/app";
import { useTranslation } from "react-i18next";

export interface Props {
    className?: string;
}
export interface KeyValuePair<T> {
    [key: string]: T;
}
export interface Sortable {
    sortid: string;
}

export interface Subscription extends Sortable {
    id: string;
    title: string;
    iconUrl?: string;
    iconName?: string;
}

export interface InoreaderTag extends Sortable {
    id: string;
    type?: "tag" | "folder" | "active_search";
    unread_count?: number;
    unseen_count?: number;
}

export interface SubscriptionEntity {
    subscription: { [key: string]: Subscription };
}

export interface Folder extends InoreaderTag {
    isCollapsed?: boolean;
}

export interface FolderEntity {
    folder: { [key: string]: Folder };
}

export const getTagNameFromId = (tagId: string): string => {
    const slice: string[] = tagId.split("/");
    return slice[slice.length - 1];
};

const OverviewPane = ({ className }: Props) => {
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation();
    
    const isIconDisplay = useSelector<RootState, any>(
        (state) => state.userInterface.isSubscriptionIconDisplay
    );
    const userInfo = useSelector<RootState, any>((state) => state.userInfo);

    const dispatch = useDispatch<Dispatch>();

    const { width: windowWidth } = useWindowSize();

    const queryClient = useQueryClient();

    const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
        if (!props) {
            return null;
        }

        const iconRender = (): ReactElement | null => {
            if (props.type === "feed") {
                if (isIconDisplay && props.iconUrl) {
                    return (
                        <div className="mr-2 w-6 text-center">
                            <img
                                className="w-4 h-4 mx-auto"
                                src={props.iconUrl}
                                alt=""
                            />
                        </div>
                    );
                } else {
                    return (
                        <Icon
                            iconName={props.iconName}
                            className="mr-2 w-6 h-6 leading-6"
                        />
                    );
                }
            }

            return (
                <Icon
                    iconName={props.iconName}
                    className="mr-2 w-6 h-6 leading-6"
                />
            );
        };

        return (
            <Stack horizontal verticalAlign="center" className="w-full">
                {iconRender()}
                <Text block nowrap className="flex-1 text-left">
                    {props.name}
                </Text>
                {props.type !== "feed" && props.unreadCount !== 0 ? (
                    <span>{props.unreadCount}</span>
                ) : null}
            </Stack>
        );
    };

    const subscriptionsListData = queryClient.getQueryData(
        "home/subscriptionsListQuery"
    );
    const folderData = queryClient.getQueryData("home/folderQuery");
    const streamPreferencesData = queryClient.getQueryData("streamPreferences");

    if (!subscriptionsListData || !folderData || !streamPreferencesData) {
        return null;
    }

    const handleLinkClick = (
        e?: React.MouseEvent<HTMLElement>,
        item?: INavLink
    ) => {
        e?.preventDefault();

        if (windowWidth <= 640) {
            dispatch.app.changeActivedScreen(ScreenPosition.Center);
        }

        history.push({
            pathname: `/feed/${encodeURIComponent(String(item?.key))}`,
        });
    };

    const getIdBySortidCurry = ({
        subscriptionById,
        tagsById,
    }: {
        subscriptionById: {
            [key: string]: Subscription;
        };
        tagsById: {
            [key: string]: Folder;
        };
    }) => {
        const createIdTableIndexedBySortid = (tagsById: {
            [id: string]: Sortable;
        }): { [sortId: string]: string } => {
            let result = {};
            for (const id in tagsById) {
                if (Object.prototype.hasOwnProperty.call(tagsById, id)) {
                    const tag = tagsById[id];
                    result[tag.sortid] = id;
                }
            }
            return result;
        };

        const subscriptionIdTableIndexBySortid =
            createIdTableIndexedBySortid(subscriptionById);

        const tagIdTableIndexBySortid = createIdTableIndexedBySortid(tagsById);

        const sortidToIdMap = {
            ...subscriptionIdTableIndexBySortid,
            ...tagIdTableIndexBySortid,
        };

        return (sortid: string) => sortidToIdMap[sortid];
    };

    const createLinkUrl = ((search: string) => {
        const queryObject = queryString.parse(search);
        return (id: string) => {
            return `/feed?${queryString.stringify({
                ...queryObject,
                streamId: id,
            })}`;
        };
    })(location.search);

    const getLinks = (streamPref: IdValuePair[]): any[] => {
        const getSortIdString = (streamPref: IdValuePair[]): string => {
            return streamPref[streamPref.length - 1]?.value;
        };

        const chunck = (str: string): string[] => {
            return str.match(/.{1,8}/g) || [];
        };

        const sortIdString = getSortIdString(streamPref);
        const childrenSortIds = chunck(sortIdString);
        const links = childrenSortIds;
        return links;
    };

    const createBuildInNavLink = ({ name, id, iconName }): INavLink => {
        return {
            name,
            key: id,
            url: createLinkUrl(id),
            type: "buildIn",
            iconName,
        };
    };

    const createLink = (subscription: Subscription): INavLink => {
        return {
            name: subscription.title,
            key: subscription.id,
            url: createLinkUrl(subscription.id),
            type: "feed",
            iconUrl: subscription.iconUrl,
        };
    };

    const createTagLink = (tag: Tag): INavLink => {
        return {
            name: getTagNameFromId(tag.id),
            key: tag.id,
            url: createLinkUrl(tag.id),
            type: "tag",
            iconName: "Tag",
            unreadCount: tag.unread_count,
        };
    };

    const createFolderLink = (
        tag: Tag,
        links: INavLink[],
        id?: string
    ): INavLink => {
        if (!tag && id) {
            const name = getTagNameFromId(id);
            return {
                name,
                links: links,
                key: id,
                url: createLinkUrl(id),
                type: "folder",
                iconName: "FolderHorizontal",
            };
        } else {
            const name = getTagNameFromId(tag.id);
            return {
                name: name,
                links: links,
                key: tag.id,
                url: createLinkUrl(tag.id),
                type: "folder",
                iconName: "FolderHorizontal",
                unreadCount: tag?.unread_count,
            };
        }
    };

    const getNavLinkGroupProps = (
        rootStreamId: string,
        {
            subscriptionById,
            tagsById,
            streamPrefById,
        }: {
            subscriptionById: KeyValuePair<Subscription>;
            tagsById: KeyValuePair<Folder>;
            streamPrefById: KeyValuePair<IdValuePair[]>;
        }
    ): INavLinkGroup | null => {
        if (!subscriptionById || !tagsById || !streamPrefById) {
            return null;
        }

        const getIdBySortid = getIdBySortidCurry({
            subscriptionById,
            tagsById,
        });

        const _getNavLinkGroupProps = (id: string): any => {
            const isFeedId = (id: string): boolean => {
                return !!id && id.startsWith("feed/");
            };

            if (isFeedId(id)) {
                const subscription = subscriptionById[id];
                return createLink(subscription);
            } else {
                const tag = tagsById[id];
                if (tag && tag.type === "tag") {
                    return createTagLink(tag);
                } else {
                    const links = getLinks(streamPrefById[id])
                        .map(getIdBySortid)
                        .map(_getNavLinkGroupProps);
                    return createFolderLink(tag, links, id);
                }
            }
        };

        return _getNavLinkGroupProps(rootStreamId);
    };

    const allArticleStreamId = `user/${userInfo?.userId}/state/com.google/root`

    let group = getNavLinkGroupProps(
        allArticleStreamId,
        {
            subscriptionById: get(
                subscriptionsListData,
                "entities.subscription"
            ),
            tagsById: get(folderData, "entities.folder"),
            streamPrefById: get(streamPreferencesData, "streamprefs"),
        }
    );

    if (group) {
        const allLink = createBuildInNavLink({
            id: allArticleStreamId,
            name: t("all article"),
            iconName: "PreviewLink",
        });

        const favLink = createBuildInNavLink({
            id: SystemStreamIDs.STARRED,
            name: t("stared article"),
            iconName: "FavoriteStar",
        });

        group.links.unshift(allLink, favLink);
    }

    const commandItems: ICommandBarItemProps[] = [
        {
            key: "addSubscription",
            text: t("add subscription"),
            iconOnly: true,
            iconProps: { iconName: "Add" },
            onClick: () =>
                dispatch.globalModal.openModal(ModalKeys.AddFeedModal),
        },
    ];

    return (
        <Stack className={`${className} min-h-0`}>
            <Stack className="py-2 pl-2" horizontal verticalAlign="center">
                <IconButton
                    className="sm:hidden mr-2"
                    iconProps={{ iconName: "GlobalNavButton" }}
                    onClick={() =>
                        dispatch.app.changeActivedScreen(ScreenPosition.Center)
                    }
                />
                <Text className="text-xl font-semibold flex-1">NoFeeding</Text>
                <CommandBar
                    className=""
                    items={commandItems}
                    styles={{ root: "p-0" }}
                />
            </Stack>
            <Nav
                styles={{
                    chevronButton: "",
                    link: "pl-8 pr-6",
                    compositeLink: "",
                }}
                groups={group ? [group] : null}
                onRenderLink={onRenderLink}
                onLinkClick={handleLinkClick}
                onRenderGroupHeader={() => null}
            />
        </Stack>
    );
};

export default React.memo(OverviewPane);
