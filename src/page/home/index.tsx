import { useState, useEffect, useContext } from "react";
import { useWindowSize } from "react-use";
import { Stack, Modal } from "@fluentui/react";
import { ViewType, ViewTypeContext } from "../../context/viewType";

import { default as FeedPage } from "../feed";
import OverviewPane from "../feed/overviewPane";
import ViewSettingPane from "./viewSettingPane";
import SideBar from "./sideBar";
import AddFeed from "./AddFeed";
import HelfScreenPanel from "../../component/halfScreenPanel/halfScreenPanel";

const Home = () => {
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState<boolean>(false);
  const [isViewSettingPaneOpen, setIsViewSettingPaneOpen] =
    useState<boolean>(false);

  const { height: windowHeight, width } = useWindowSize();
  const { viewType, setViewType } = useContext(ViewTypeContext);

  useEffect(() => {
    if (viewType === ViewType.threeway && width < 1280) {
      setViewType(ViewType.card);
    }
  }, [viewType, width, setViewType]);

  return (
    <Stack
      horizontal
      className="overflow-hidden w-full"
      style={{ height: windowHeight }}
    >
      <SideBar
        className="z-50 w-12"
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
