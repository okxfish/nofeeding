import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import BookFilp from "./component/bookFilp/index";
import Oauth from "./page/oauth/index";
import { ViewType, ViewTypeContext } from "./context/viewType";
import { initSetting, SettingContext } from "./context/setting";
import { useInoreaderToken } from "./utils/useInoreaderToken";

import "./App.css";
import "./style/utils.css";

const CallBackOnUnmount = ({ cb }) => {
  useEffect(() => () => cb(), [cb]);
  return null;
};

const Login = lazy(() => import("./page/login"));
const Home = lazy(() => import("./page/home"));

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewType, setViewType] = useState(ViewType.magazine);
  const [setting, setSetting] = useState(initSetting);
  const inoreaderToken = useInoreaderToken();

  return (
    <div className="App">
      <SettingContext.Provider value={{ setting, setSetting }}>
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
              fallback={<CallBackOnUnmount cb={() => setIsLoading(false)} />}
            >
              <Switch>
                <Route path="/oauth" component={Oauth} />
                <Route path="/login" component={Login} />
                <Route
                  path={["/feed", "/setting"]}
                  render={() => {
                    if (inoreaderToken) {
                      return <Home />;
                    } else {
                      return <Redirect path="/" to="/login" />;
                    }
                  }}
                />
                <Redirect path="/" to="/feed" />
              </Switch>
            </Suspense>
          </Router>
        </ViewTypeContext.Provider>
      </SettingContext.Provider>
    </div>
  );
}

export default App;
