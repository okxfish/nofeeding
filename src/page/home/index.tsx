import api from "../../api";
import React, { lazy, useEffect, Suspense, useRef } from "react";
import { useWindowSize } from "react-use";
import { Route, Switch } from "react-router-dom";
import { Stack, Modal } from "@fluentui/react";
import { Subscription, SubscriptionEntity } from "../feed/types";
import ViewSettingPane from "./viewSettingPane";
import AddFeed from "./AddFeed";
import HelfScreenPanel from "../../component/halfScreenPanel/halfScreenPanel";
import { get } from "lodash";
import { useQuery } from "react-query";
import { normalize, schema, NormalizedSchema } from "normalizr";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../model";
import { ModalKeys } from "../../model/globalModal";
import { ViewType } from "../../model/userInterface";
import NavBar from "./NavBar";

const subscription = new schema.Entity("subscription", undefined);

const FeedPage = lazy(() => import("../feed"));
const SettingsPage = lazy(() => import("../settings"));

const Home = () => {
    const viewType = useSelector<RootState, any>(
        (state) => state.userInterface.viewType
    );
    const isAddFeedModalOpened = useSelector<RootState, any>(
        (state) => state.globalModal[ModalKeys.AddFeedModal]
    );
    const isViewSettingPaneOpened = useSelector<RootState, any>(
        (state) => state.globalModal[ModalKeys.ViewSettingPane]
    );
    const dispatch = useDispatch<Dispatch>();
    const scrollArea = useRef<HTMLDivElement>(null);
    const { height: windowHeight, width } = useWindowSize();

    useEffect(() => {
        if (width <= 640 || (viewType === ViewType.threeway && width < 1120)) {
            dispatch.userInterface.changeViewType(ViewType.magazine);
        }
    }, [viewType, width]);

    const subscriptionsListQuery = useQuery<
        NormalizedSchema<SubscriptionEntity, string[]>
    >(
        "home/subscriptionsListQuery",
        async () => {
            const subscriptionList = await api.inoreader.getSubscriptionList();
            const subscriptions = get(subscriptionList, "data.subscriptions");
            const subscriptionsNormalized = normalize<
                Subscription,
                SubscriptionEntity
            >(subscriptions, [subscription]);
            return subscriptionsNormalized;
        },
        {
            refetchOnWindowFocus: false,
        }
    );

    const onModalsRender = () => {
        return (
            <>
                <Modal
                    isOpen={isAddFeedModalOpened}
                    isBlocking={false}
                    onDismiss={() =>
                        dispatch.globalModal.closeModal(ModalKeys.AddFeedModal)
                    }
                >
                    <AddFeed
                        onCancel={() =>
                            dispatch.globalModal.closeModal(
                                ModalKeys.AddFeedModal
                            )
                        }
                    />
                </Modal>
                <HelfScreenPanel
                    isOpen={isViewSettingPaneOpened}
                    isLightDismiss
                    hasCloseButton={false}
                    onDismiss={() =>
                        dispatch.globalModal.closeModal(
                            ModalKeys.ViewSettingPane
                        )
                    }
                    onLightDismissClick={() =>
                        dispatch.globalModal.closeModal(
                            ModalKeys.ViewSettingPane
                        )
                    }
                >
                    <ViewSettingPane />
                </HelfScreenPanel>
            </>
        );
    };

    return (
        <Stack
            style={{
                height: windowHeight,
            }}
            className="w-full"
        >
            <Stack
                className="overflow-y-hidden flex-col sm:flex-row"
                grow
                disableShrink={false}
            >
                <NavBar className="hidden sm:flex" />
                <div
                    className="flex flex-1 flex-nowrap overflow-hidden relative"
                    role="main"
                    ref={scrollArea}
                >
                    <Suspense fallback={() => null}>
                        <Switch>
                            <Route path="/settings" component={SettingsPage} />
                            <Route
                                path={["/feed/:streamId?/:articleId?", "/"]}
                                component={FeedPage}
                            />
                        </Switch>
                    </Suspense>
                </div>
            </Stack>
            {onModalsRender()}
        </Stack>
    );
};

export default Home;
