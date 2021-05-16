import React, { useState } from "react";
import { default as FeedPage } from "../feed";
import { useWindowSize } from "react-use";
import { Route, Switch } from "react-router-dom";
import "./style.css";
import SideBar from "./sideBar";
import Setting from "../setting/index";

const Home = () => {
  const { height: windowHeight } = useWindowSize();
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const emptyRender = (): React.ReactElement | null => null;

  return (
    <div
      className="home__layout overflow-hidden"
      style={{ height: windowHeight }}
    >
      <SideBar setIsOverViewPaneOpen={setIsOverViewPaneOpen} />
      <Switch>
        <Route
          path={["/feed/:options", "/feed"]}
          render={() => (
            <FeedPage
              isOverViewPaneOpen={isOverViewPaneOpen}
              setIsOverViewPaneOpen={setIsOverViewPaneOpen}
            />
          )}
        />
        <Route path="/setting" render={Setting} />
      </Switch>
    </div>
  );
};

export default Home;
