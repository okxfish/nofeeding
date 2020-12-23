import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "./style/utils.css";

const Home = lazy(() => import("./page/home"));

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>loading</div>}>
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
