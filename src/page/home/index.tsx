import { useState, useEffect } from "react";
import { default as FeedPage } from "../feed";
import { useWindowSize } from "react-use";
import { Route, Switch, useLocation } from "react-router-dom";
import OverviewPane from "../feed/overviewPane";
import SideBar from "./sideBar";
import "./style.css";
import HelfScreenPanel from "../../component/helfScreenPanel/helfScreenPanel";

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
      <HelfScreenPanel
        isOpen={isOverViewPaneOpen}
        isLightDismiss
        hasCloseButton={false}
        onDismiss={() => setIsOverViewPaneOpen(false)}
        onLightDismissClick={() => setIsOverViewPaneOpen(false)}
      >
        <OverviewPane />
      </HelfScreenPanel>
    </div>
  );
};

export default Home;
