import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import "./App.css";
import "./style/utils.css";

const Home = lazy(() => import("./page/home"));
function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<Spinner className="m-auto mt-72" size={SpinnerSize.large} label="loading..."/>}>
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;