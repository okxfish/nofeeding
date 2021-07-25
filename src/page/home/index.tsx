import { useState, useEffect, useContext } from "react";
import { useWindowSize } from "react-use";
import { Stack, Modal, NeutralColors, IconButton } from "@fluentui/react";
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
    isDarkMode,
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
      style={{
        height: windowHeight,
      }}
      className="w-full"
    >
      <Stack horizontal className="h-12" style={{flexShrink: 0}}>
        <IconButton iconProps={{iconName: 'Back'}} className="w-12 h-12"/>
      </Stack>
      <Stack
        className="overflow-y-hidden flex-col sm:flex-row"
      >
        <SideBar
          className="z-50 sm:w-12 flex-row sm:flex-col order-last sm:order-first"
          setIsOverViewPaneOpen={setIsOverViewPaneOpen}
          setIsViewSettingPaneOpen={setIsViewSettingPaneOpen}
          setIsAddFeedModalOpen={setIsAddFeedModalOpen}
        />
        <Stack
          horizontal
          className="overflow-y-hidden flex-1 space-x-2 pr-4"
          role="main"
        >
          <FeedPage />
        </Stack>
      </Stack>
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
