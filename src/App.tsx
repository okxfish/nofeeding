import React, { useState, useEffect, Suspense, lazy } from "react";
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import BookFilp from "./component/bookFilp/index";
import "./App.css";
import "./style/utils.css";
import { ViewType, ViewTypeContext } from "./context/viewType";

const CallBackOnUnmount = ({ cb }) => {
  useEffect(() => () => cb(), [cb]);
  return null;
};

const Home = lazy(() => import("./page/home"));
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewType, setViewType] = useState(ViewType.magazine);

  return (
    <div className="App">
      <ViewTypeContext.Provider value={{ viewType, setViewType }}>
        <Router>
          <CSSTransition
            in={isLoading}
            timeout={{
              exit: 400,
            }}
            unmountOnExit
            className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center pt-32 z-50 full-screen-loading__animation-wrapper"
          >
            <div className="full-screen-loading__wrapper">
              <BookFilp />
              {/* <div className="mt-4 text-sm">loading...</div> */}
            </div>
          </CSSTransition>
          <Suspense
            fallback={
              <CallBackOnUnmount
                cb={() => setIsLoading(false)}
              />
            }
          >
            <Switch>
              <Route path="/:pageName" component={Home} />
              <Redirect path="/" to="/feed" exact />
            </Switch>
          </Suspense>
        </Router>
      </ViewTypeContext.Provider>
    </div>
  );
}

export default App;
