import { useState, useEffect } from "react";
import { default as FeedPage } from "../feed";
import { useWindowSize } from "react-use";
import { Route, Switch, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import OverviewPane from "../feed/overviewPane";
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
      <CSSTransition
        classNames="block sm:hidden overview-pane-animate-wrapper overview-pane-animate-wrapper"
        in={isOverViewPaneOpen}
        timeout={{ exit: 400, enter: 0 }}
        unmountOnExit
      >
        <div className="z-50">
          <div
            className="overview-pane__mask fixed top-0 left-0 w-screen h-screen"
            onClick={closeOverviewPane}
          />
          <OverviewPane className="bg-white rounded-t-2xl shadow-lg pt-6 px-2 sm:rounded-none sm:pt-0 overview-pane overview-pane-modal" />
        </div>
      </CSSTransition>
    </div>
  );
};

export default Home;
