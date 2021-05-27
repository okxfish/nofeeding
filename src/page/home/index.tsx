import React, { useState } from "react";
import { default as FeedPage } from "../feed";
import { useWindowSize } from "react-use";
import { Route, Switch } from "react-router-dom";
import SideBar from "./sideBar";
import "./style.css";

const Home = () => {
  const { height: windowHeight } = useWindowSize();
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);

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
      </Switch>
    </div>
  );
};

export default Home;
