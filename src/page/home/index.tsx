import { useState, useEffect } from "react";
import { default as FeedPage } from "../feed";
import { useWindowSize } from "react-use";
import { Route, Switch, useLocation } from "react-router-dom";
import OverviewPane from "../feed/overviewPane";
import { Panel, PanelType } from "@fluentui/react";
import SideBar from "./sideBar";
import "./style.css";

const Home = () => {
  const location = useLocation();
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const { height: windowHeight } = useWindowSize();

  const closeOverviewPane = (): void => setIsOverViewPaneOpen(false);

  // 切换当前的订阅源的时候关闭订阅源选择菜单
  useEffect(() => {
    closeOverviewPane();
  }, [location.search]);

  return (
    <div
      className="home__layout overflow-hidden"
      style={{ height: windowHeight }}
    >
      <SideBar setIsOverViewPaneOpen={setIsOverViewPaneOpen} />
      <Switch>
        <Route path={["/feed/:options", "/feed"]} component={FeedPage} />
      </Switch>
      <Panel
        isOpen={isOverViewPaneOpen}
        type={PanelType.smallFluid}
        styles={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
          main: [
            {
              height: "80vh",
              width: "100vw",
              margin: "auto 0 0",
              animationName: "none",
            },
            "$ms-motion-duration-4 rounded-t-lg",
            isOverViewPaneOpen
              ? "ms-motion-slideUpIn"
              : "ms-motion-slideDownOut",
          ],
          content: 'px-0',
          scrollableContent: 'scrollbar-none'
        }}
        onDismiss={() => setIsOverViewPaneOpen(false)}
        isLightDismiss
        hasCloseButton={false}
        onLightDismissClick={() => setIsOverViewPaneOpen(false)}
      >
        <OverviewPane />
      </Panel>
    </div>
  );
};

export default Home;
