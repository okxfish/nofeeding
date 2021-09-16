import api from "../../api";
import { 
  lazy,
  useEffect,
  useContext,
  Suspense,
  useRef
 } from "react";
import { useWindowSize } from "react-use";
import { DispatchContext, SettingContext, StoreContext } from "../../context";
import { Route, Switch } from "react-router-dom";
import { Stack, Modal } from "@fluentui/react";
import {
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
import { useSelector } from "react-redux";

const subscription = new schema.Entity("subscription", undefined);
const folder = new schema.Entity("folder");

const FeedPage = lazy(() => import("../feed"));
const SettingsPage = lazy(() => import("../settings"));

const Home = () => {
  const {
    layout: { viewType },
  } = useContext(SettingContext);
  const { modals } = useContext(StoreContext);
  const store = useSelector(state=>state);
  console.log('store', store)

  const dispatch = useContext(DispatchContext);
  const scrollArea = useRef<HTMLDivElement>(null)
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
        <NavBar className="hidden sm:flex"/>
        <div
          className="flex flex-1 flex-nowrap overflow-hidden relative"
          role="main"
          ref={scrollArea}
        >
          <Suspense fallback={() => null}>
            <Switch>
              <Route path="/settings" component={SettingsPage} />
              <Route path={["/", "/feed"]} component={FeedPage} />
            </Switch>
          </Suspense>
        </div>
      </Stack>
      {onModalsRender()}
    </Stack>
  );
};

export default Home;
