import { useState, useEffect, useReducer, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import BookFilp from "./component/bookFilp/index";
import Oauth from "./page/oauth/index";
import {
  UserInfoContext,
  CurrenActivedFeedIdContext,
  DispatchContext,
  StoreContext,
  SettingContext,
} from "./context";
import { default as api } from "./api";
import { useInoreaderToken } from "./utils/useInoreaderToken";
import { useQuery } from "react-query";
import { getInitSetting, reducer } from "./reducer";
import { ThemeProvider, getTheme, mergeStyleSets } from "@fluentui/react";
import { lightTheme, darkTheme } from "./theme";
import classnames from "classnames";
import "./App.css";
import "./style/utils.css";

const CallBackOnUnmount = ({ cb }) => {
  useEffect(() => () => cb(), [cb]);
  return null;
};

const Login = lazy(() => import("./page/login"));
const Home = lazy(() => import("./page/home"));

const currentTheme = getTheme();
console.log(currentTheme);

function App() {
  const [store, dispatch] = useReducer(reducer, undefined, () => {
    return {
      currenActivedFeedId: "",
      isArticleModalOpen: false,
      isOverviewPaneOpen: true,
      modals: {},
      setting: getInitSetting(),
    };
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const inoreaderToken = useInoreaderToken();

  const userInfoQuery = useQuery(
    ["userInfo", inoreaderToken],
    async () => {
      const res = await api.inoreader.getUserInfo();
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!inoreaderToken,
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem("setting", JSON.stringify(store.setting));
    } catch (error) {
      console.error(error);
    }
  }, [store.setting]);

  const loaddingAnimationRender = () => {
    return (
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
        </div>
      </CSSTransition>
    );
  };

  const { currenActivedFeedId, setting } = store;

  const theme = setting.isDarkMode ? darkTheme : lightTheme;

  const appClassNames = mergeStyleSets({
    app: [{
      backgroundColor: theme?.palette?.neutralLight,
      color: theme?.palette?.black,
    }]
  })
  
  return (
    <ThemeProvider
      applyTo="body"
      theme={theme}
    >
      <StoreContext.Provider value={store}>
        <DispatchContext.Provider value={dispatch}>
          <CurrenActivedFeedIdContext.Provider value={currenActivedFeedId}>
            <SettingContext.Provider value={setting}>
              <UserInfoContext.Provider value={userInfoQuery.data}>
                <div
                  className={classnames("App", appClassNames.app, { dark: setting.isDarkMode })}
                >
                  <Router>
                    {/* {loaddingAnimationRender()} */}
                    <Suspense
                      fallback={
                        <CallBackOnUnmount cb={() => setIsLoading(false)} />
                      }
                    >
                      <Switch>
                        <Route path="/oauth" component={Oauth} />
                        <Route path="/login" component={Login} />
                        <Route
                          path="/"
                          render={() => {
                            if (inoreaderToken) {
                              return <Home />;
                            } else {
                              return <Redirect path="/" to="/login" />;
                            }
                          }}
                        />
                      </Switch>
                    </Suspense>
                  </Router>
                </div>
              </UserInfoContext.Provider>
            </SettingContext.Provider>
          </CurrenActivedFeedIdContext.Provider>
        </DispatchContext.Provider>
      </StoreContext.Provider>
    </ThemeProvider>
  );
}

export default App;
