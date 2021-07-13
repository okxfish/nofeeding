import { useState, useEffect, useContext } from "react";
import { useWindowSize } from "react-use";
import { Stack, Modal } from "@fluentui/react";
import { ViewType } from "../../context/setting";
import { default as FeedPage } from "../feed";
import OverviewPane from "../feed/overviewPane";
import ViewSettingPane from "./viewSettingPane";
import SideBar from "./sideBar";
import AddFeed from "./AddFeed";
import HelfScreenPanel from "../../component/halfScreenPanel/halfScreenPanel";
import { CHANGE_VIEW_TYPE } from "../../App";
import { DispatchContext, SettingContext } from "../../context";

const Home = () => {
  const {
    layout: { viewType },
  } = useContext(SettingContext);
  const dispatch = useContext(DispatchContext);

  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState<boolean>(false);
  const [isViewSettingPaneOpen, setIsViewSettingPaneOpen] =
    useState<boolean>(false);

  const { height: windowHeight, width } = useWindowSize();

  useEffect(() => {
    if (viewType === ViewType.threeway && width < 1280) {
      dispatch({ type: CHANGE_VIEW_TYPE, viewType: ViewType.card });
    }
  }, [viewType, width, dispatch]);

  return (
    <Stack
      horizontal
      className="overflow-hidden w-full flex-col sm:flex-row"
      style={{ height: windowHeight }}
    >
      <SideBar
        className="z-50 sm:w-12 flex-row sm:flex-col order-last sm:order-first bg-gray-600 bg-opacity-80 text-current text-white"
        setIsOverViewPaneOpen={setIsOverViewPaneOpen}
        setIsViewSettingPaneOpen={setIsViewSettingPaneOpen}
        setIsAddFeedModalOpen={setIsAddFeedModalOpen}
      />
      <FeedPage />
      <Modal
        isOpen={isAddFeedModalOpen}
        isBlocking={false}
        onDismiss={() => setIsAddFeedModalOpen(false)}
      >
      <AddFeed onCancel={() => setIsAddFeedModalOpen(false)} />
      </Modal>
      <HelfScreenPanel
        isOpen={isOverViewPaneOpen}
        isLightDismiss
        hasCloseButton={false}
        onDismiss={() => setIsOverViewPaneOpen(false)}
        onLightDismissClick={() => setIsOverViewPaneOpen(false)}
        styles={{ content: "p-0" }}
      >
        <OverviewPane />
      </HelfScreenPanel>
      <HelfScreenPanel
        isOpen={isViewSettingPaneOpen}
        isLightDismiss
        hasCloseButton={false}
        onDismiss={() => setIsViewSettingPaneOpen(false)}
        onLightDismissClick={() => setIsViewSettingPaneOpen(false)}
      >
        <ViewSettingPane />
      </HelfScreenPanel>
    </Stack>
  );
};

export default Home;
