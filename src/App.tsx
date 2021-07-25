import React, { useState, useEffect, useReducer, Suspense, lazy } from "react";
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
  FeedThumbnailDisplayType,
  initSetting,
  SettingState,
  ViewType,
} from "./context/setting";
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
import { NeutralColors, ThemeProvider } from "@fluentui/react";
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

export const OPEN_AIRTICLE_MODAL = "OPEN_AIRTICLE_MODAL";
export const CLOSE_AIRTICLE_MODAL = "CLOSE_AIRTICLE_MODAL";
export const CHANGE_SELECTED_ARTICLE = "CHANGE_SELECTED_ARTICLE";
export const CHANGE_VIEW_TYPE = "CHANGE_VIEW_TYPE";

interface Store {
  currenActivedFeedId: string;
  isArticleModalOpen: boolean;
  setting: SettingState;
}

type Action =
  | { type: "CHANGE_SELECTED_ARTICLE"; articleId: string }
  | { type: "CHANGE_VIEW_TYPE"; viewType: ViewType }
  | { type: "OPEN_AIRTICLE_MODAL" | "CLOSE_AIRTICLE_MODAL" }
  | { type: "TOGGLE_UNREAD_ONLY" }
  | { type: "TOGGLE_DARK_THEME" }
  | { type: "CHANGE_TO_DARK_THEME" }
  | { type: "CHANGE_TO_LIGHT_THEME" }
  | {
      type: "CHANGE_THUMBNAIL_DISPLAY_TYPE";
      displayType: FeedThumbnailDisplayType;
    };

const reducer = (prevState: Store, action: Action) => {
  switch (action.type) {
    case "CHANGE_SELECTED_ARTICLE":
      return { ...prevState, currenActivedFeedId: action.articleId };
    case "CHANGE_VIEW_TYPE":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          layout: {
            ...prevState.setting.layout,
            viewType: action.viewType,
          },
        },
      };
    case "OPEN_AIRTICLE_MODAL":
      return { ...prevState, isArticleModalOpen: true };
    case "CLOSE_AIRTICLE_MODAL":
      return { ...prevState, isArticleModalOpen: false };
    case "CHANGE_THUMBNAIL_DISPLAY_TYPE":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          feed: {
            ...prevState.setting.feed,
            feedThumbnailDisplayType: action.displayType,
          },
        },
      };
    case "TOGGLE_UNREAD_ONLY":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          feed: {
            ...prevState.setting.feed,
            unreadOnly: !prevState.setting.feed.unreadOnly,
          },
        },
      };
    case "TOGGLE_DARK_THEME":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          isDarkMode: !prevState.setting.isDarkMode,
        },
      };
    case "CHANGE_TO_DARK_THEME":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          isDarkMode: true,
        },
      };
    case "CHANGE_TO_LIGHT_THEME":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          isDarkMode: false,
        },
      };
    default:
      return { ...prevState };
  }
};

const getInitSetting = ():SettingState => {
  let result:SettingState = initSetting;
  try {
    const localSetting:string|null = localStorage.getItem('setting');
    if(localSetting){
      result =  JSON.parse(localSetting);
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}

function App() {
  const [store, dispatch] = useReducer(reducer, undefined, () => {
    return {
      currenActivedFeedId: "",
      isArticleModalOpen: false,
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

  useEffect(()=>{
    try {
      localStorage.setItem('setting', JSON.stringify(store.setting));
    } catch (error) {
      console.error(error);
    }
  },[store.setting]);

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

  return (
    <ThemeProvider
      applyTo="body"
      theme={setting.isDarkMode ? darkTheme : lightTheme}
    >
      <StoreContext.Provider value={store}>
        <DispatchContext.Provider value={dispatch}>
          <CurrenActivedFeedIdContext.Provider value={currenActivedFeedId}>
            <SettingContext.Provider value={setting}>
              <UserInfoContext.Provider value={userInfoQuery.data}>
                <div
                  className={classnames("App", { dark: setting.isDarkMode })}
                  style={{
                    backgroundColor: setting.isDarkMode ? NeutralColors.gray200 : NeutralColors.gray30
                  }}
                >
                  <Router>
                    {loaddingAnimationRender()}
                    <Suspense
                      fallback={
                        <CallBackOnUnmount cb={() => setIsLoading(false)} />
                      }
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
