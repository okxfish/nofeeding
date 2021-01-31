import React, { useState, Suspense, lazy } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import "./App.css";
import "./style/utils.css";
import { ViewType, ViewTypeContext } from "./context/viewType";

const Home = lazy(() => import("./page/home"));
function App() {
  const [viewType, setViewType] = useState(ViewType.magazine);

  return (
    <div className="App">
      <ViewTypeContext.Provider value={{ viewType, setViewType }}>
        <Router>
          <Suspense
            fallback={
              <Spinner
                className="m-auto mt-72"
                size={SpinnerSize.large}
                label="loading..."
              />
            }
          >
            <Switch>
              <Route path="/" component={Home} />
            </Switch>
          </Suspense>
        </Router>
      </ViewTypeContext.Provider>
    </div>
  );
}

export default App;
