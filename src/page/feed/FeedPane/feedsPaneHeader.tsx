import { default as React } from "react";
import { IconButton, Stack, Text } from "@fluentui/react";
import { get } from "lodash";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dispatch, RootState } from "../../../model";
import { getTagNameFromId } from "../SubscriptionsPane/utils";
import { ScreenPosition } from "../../../model/app";
import { Subscription } from "../../../api/mockData";
import FeedPaneCommandBar from "./feedPaneCommandBar";

export interface Props {
    className?: string;
    getScrollParent(): any;
}

const FeedsPaneHeader = () => {
    const userId = useSelector<RootState, any>(
        (state) => state.userInfo.userId
    );
    const dispatch = useDispatch<Dispatch>();
    const queryClient = useQueryClient();
    const routeParams = useParams<{ streamId: string }>();
    const { t } = useTranslation(["translation", "viewSettings"]);

    const streamId = routeParams.streamId
        ? decodeURIComponent(routeParams.streamId)
        : `user/${userId}/state/com.google/root`;

    const subscriptionsList = queryClient.getQueryData(
        "home/subscriptionsListQuery"
    );

    const getSubscriptionById = (id: any): Subscription =>
        get(subscriptionsList, `entities.subscription['${id}']`);

    const subscription = getSubscriptionById(streamId);

    const getFolderName = (streamId: string): string => {
        if (!streamId) return t("all article");
        if (typeof streamId === "string") {
            const tagName = getTagNameFromId(streamId);
            if (tagName === "root") {
                return t("all article");
            } else if (tagName === "starred") {
                return t("stared article");
            } else {
                return tagName;
            }
        } else {
            return "";
        }
    };

    const name = subscription ? subscription.title : getFolderName(streamId);

    return (
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
            <FeedPaneCommandBar />
        </Stack>
    );
};

export default React.memo(FeedsPaneHeader);
