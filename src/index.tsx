import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeIcons } from "@uifabric/icons";
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient();

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

/*
       ／＞　　フ
       | 　~　~|
      ／`ミ＿xノ
     /　ヽ　　 ﾉ
 ／￣|　　|　|　|
| (￣ヽ＿_ヽ_)__)
＼二つ
*/
