import { useState, useEffect, Suspense, lazy } from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from "react-router-dom";
import BookFilp from "./component/bookFilp/index";
import Oauth from "./page/oauth/index";
import classnames from "classnames";
import { CSSTransition } from "react-transition-group";
import { default as api } from "./api";
import { useInoreaderToken } from "./utils/useInoreaderToken";
import { useQuery } from "react-query";
import { ThemeProvider, mergeStyleSets } from "@fluentui/react";
import { lightTheme, darkTheme } from "./theme";
import { Dispatch, RootState } from "./model";
import { useDispatch, useSelector } from "react-redux";
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
    const [inoreaderToken] = useInoreaderToken();
    const dispatch = useDispatch<Dispatch>();

    const userInfoQuery = useQuery(
        ["userInfo", inoreaderToken],
        async () => {
            const res = await api.inoreader.getUserInfo();
            dispatch.userInfo.fetchedUserInfo(res.data);
            return res.data;
        },
        {
            refetchOnWindowFocus: false,
            enabled: !!inoreaderToken,
        }
    );

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

    const isDarkMode = useSelector<RootState, any>(
        (state) => state.userInterface.isDarkMode
    );

    const theme = isDarkMode ? darkTheme : lightTheme;

    const appClassNames = mergeStyleSets({
        app: [
            {
                backgroundColor: theme?.palette?.neutralLight,
                color: theme?.palette?.black,
            },
        ],
    });

    return (
        <ThemeProvider applyTo="body" theme={theme}>
            <div
                className={classnames("App", appClassNames.app, {
                    dark: isDarkMode,
                })}
            >
                <Router>
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
                                        return (
                                            <Redirect path="/" to="/login" />
                                        );
                                    }
                                }}
                            />
                        </Switch>
                    </Suspense>
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
