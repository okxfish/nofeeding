import api from "../../api";
import { lazy, useEffect, useContext, Suspense } from "react";
import { useWindowSize } from "react-use";
import { DispatchContext, SettingContext, StoreContext } from "../../context";
import { Route, Switch } from "react-router-dom";
import { Stack, Modal } from "@fluentui/react";
import OverviewPane, {
  FolderEntity,
  InoreaderTag,
  Subscription,
  SubscriptionEntity,
} from "../feed/overviewPane";
import ViewSettingPane from "./viewSettingPane";
import AddFeed from "./AddFeed";
import HelfScreenPanel from "../../component/halfScreenPanel/halfScreenPanel";
import { ViewType } from "../../context/setting";
import { ModalKeys } from "../../reducer";
import { get } from "lodash";
import { useQuery } from "react-query";
import { normalize, schema, NormalizedSchema } from "normalizr";
import { StreamPreferenceListResponse } from "../../api/inoreader";
import NavBar from "./NavBar";

const subscription = new schema.Entity("subscription", undefined);
const folder = new schema.Entity("folder");

const FeedPage = lazy(() => import("../feed"));
const SettingsPage = lazy(() => import("../settings"));

const Home = () => {
  const {
    layout: { viewType },
  } = useContext(SettingContext);
  const { modals } = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);
  const { height: windowHeight, width } = useWindowSize();

  useEffect(() => {
    if (viewType === ViewType.threeway && width < 1120) {
      dispatch({ type: "CHANGE_VIEW_TYPE", viewType: ViewType.card });
    }
  }, [viewType, width, dispatch]);

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
      const foldersNormalized = normalize<InoreaderTag, FolderEntity>(tags, [
        folder,
      ]);
      return foldersNormalized;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const onModalsRender = () => {
    return (
      <>
        <Modal
          isOpen={modals[ModalKeys.AddFeedModal]}
          isBlocking={false}
          onDismiss={() =>
            dispatch({
              type: "CLOSE_MODAL",
              modalKey: ModalKeys.AddFeedModal,
            })
          }
        >
          <AddFeed
            onCancel={() =>
              dispatch({
                type: "CLOSE_MODAL",
                modalKey: ModalKeys.AddFeedModal,
              })
            }
          />
        </Modal>
        <HelfScreenPanel
          isOpen={modals[ModalKeys.OverViewPane]}
          isLightDismiss
          hasCloseButton={false}
          onDismiss={() =>
            dispatch({ type: "CLOSE_MODAL", modalKey: ModalKeys.OverViewPane })
          }
          onLightDismissClick={() =>
            dispatch({ type: "CLOSE_MODAL", modalKey: ModalKeys.OverViewPane })
          }
          styles={{ content: "p-0" }}
        >
          <OverviewPane />
        </HelfScreenPanel>
        <HelfScreenPanel
          isOpen={modals[ModalKeys.ViewSettingPane]}
          isLightDismiss
          hasCloseButton={false}
          onDismiss={() =>
            dispatch({
              type: "CLOSE_MODAL",
              modalKey: ModalKeys.ViewSettingPane,
            })
          }
          onLightDismissClick={() =>
            dispatch({
              type: "CLOSE_MODAL",
              modalKey: ModalKeys.ViewSettingPane,
            })
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
        <NavBar className="sm:border-r"/>
        <Stack
          horizontal
          grow
          className="overflow-y-hidden"
          role="main"
        >
          <Suspense fallback={() => null}>
            <Switch>
              <Route path="/settings" component={SettingsPage} />
              <Route path={["/", "/feed"]} component={FeedPage} />
            </Switch>
          </Suspense>
        </Stack>
      </Stack>
      {onModalsRender()}
    </Stack>
  );
};

export default Home;
