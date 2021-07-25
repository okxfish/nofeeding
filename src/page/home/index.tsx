import { lazy, useEffect, useContext, Suspense } from "react";
import { useWindowSize } from "react-use";
import { Stack, Modal } from "@fluentui/react";
import OverviewPane from "../feed/overviewPane";
import ViewSettingPane from "./viewSettingPane";
import AddFeed from "./AddFeed";
import HelfScreenPanel from "../../component/halfScreenPanel/halfScreenPanel";
import { CHANGE_VIEW_TYPE } from "../../App";
import { DispatchContext, SettingContext, StoreContext } from "../../context";
import SideBarButton from "./sideBarButton";
import { ViewType } from "../../context/setting";
import { Route, Switch, useHistory } from "react-router-dom";
import { ModalKeys } from "../../reducer";
import Header from './Header';

const FeedPage = lazy(() => import("../feed"));

const Home = () => {
  const {
    layout: { viewType },
  } = useContext(SettingContext);
  const { modals } = useContext(StoreContext);
  const dispatch = useContext(DispatchContext);
  const history = useHistory();

  const { height: windowHeight, width } = useWindowSize();

  useEffect(() => {
    if (viewType === ViewType.threeway && width < 1280) {
      dispatch({ type: CHANGE_VIEW_TYPE, viewType: ViewType.card });
    }
  }, [viewType, width, dispatch]);

  const onSideBarRender = ({ history }) => {
    return (
      <Stack
        className={`sm:space-y-2 z-50 sm:w-12 flex-row sm:flex-col order-last sm:order-first`}
        horizontalAlign="center"
      >
        <SideBarButton
          iconProps={{ iconName: "News" }}
          title="Settings"
          onClick={() => history.push("/")}
        />
        <div className="flex-1"></div>
        <SideBarButton
          iconProps={{ iconName: "Settings" }}
          title="Settings"
          onClick={() => history.push("/settings")}
        />
      </Stack>
    );
  };

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
      <Header />
      <Stack
        className="overflow-y-hidden flex-col sm:flex-row"
        grow
        disableShrink={false}
      >
        {onSideBarRender({ history })}
        <Stack
          horizontal
          grow
          className="overflow-y-hidden space-x-2 pr-4"
          role="main"
        >
          <Suspense fallback={() => null}>
            <Switch>
              <Route path="/settings" render={() => null} />
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
