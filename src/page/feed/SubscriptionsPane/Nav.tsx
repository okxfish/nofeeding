import React, { ReactElement } from "react";
import {
    Stack,
    Text,
    INavLink,
    Nav,
    IRenderFunction,
    Icon,
} from "@fluentui/react";
import { get } from "lodash";
import { FolderEntity, InoreaderTag } from "../types";
import { SystemStreamIDs, StreamPreferenceListResponse } from "../../../api/inoreader";
import { useHistory } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useWindowSize } from "react-use";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState, Dispatch } from "../../../model";
import { ScreenPosition } from "../../../model/app";
import { getNavLinkGroupProps, createBuildInNavLink } from "./utils";
import { normalize, NormalizedSchema, schema } from "normalizr";
import api from "../../../api";

const folder = new schema.Entity("folder");

export interface Props {
    className?: string;
}

const SubscriptionsPaneNav = ({ className }: Props) => {
    const history = useHistory();
    const { t } = useTranslation();

    const dispatch = useDispatch<Dispatch>();

    const { width: windowWidth } = useWindowSize();

    const queryClient = useQueryClient();

    const isIconDisplay = useSelector<RootState, boolean>(
        (state) => state.userInterface.isSubscriptionIconDisplay,
        shallowEqual
    );

    const userId = useSelector<RootState, string | null | undefined>(
        (state) => state.userInfo.userId,
        shallowEqual
    );

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

    const streamPreferencesQuery = useQuery<StreamPreferenceListResponse>(
        "streamPreferences",
        async () => {
            const res = await api.inoreader.getStreamPreferenceList();
            return res.data;
        },
        {
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    const folderQuery = useQuery<NormalizedSchema<FolderEntity, string[]>>(
        "home/folderQuery",
        async () => {
            const res = await api.inoreader.getFolderOrTagList(1, 1);
            const tags = res.data.tags;
            const foldersNormalized = normalize<InoreaderTag, FolderEntity>(
                tags,
                [folder]
            );
            return foldersNormalized;
        },
        {
            refetchOnWindowFocus: false,
        }
    );

    const folderData = folderQuery.data;
    const streamPreferencesData = streamPreferencesQuery.data;

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

    const allArticleStreamId = `user/${userId}/state/com.google/root`;

    let group = getNavLinkGroupProps(allArticleStreamId, {
        subscriptionById: get(subscriptionsListData, "entities.subscription"),
        tagsById: get(folderData, "entities.folder"),
        streamPrefById: get(streamPreferencesData, "streamprefs"),
    });

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

    return (
        <Stack className={`${className} min-h-0`}>
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

export default SubscriptionsPaneNav;
