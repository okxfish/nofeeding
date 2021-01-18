import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeIcons } from "@uifabric/icons";
import FeedItem from "./component/feedsPane/feedItem";

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// ReactDOM.render(
//   <React.StrictMode>
//     <div className="bg-gray-600">
//     <FeedItem item={{ key: "1", title: "qwerassadada",groupIndex: 1 }} itemIndex={0}  />
//     </div>
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
       ／＞　　フ
       | 　~　~|
      ／`ミ＿xノ
     /　ヽ　　 ﾉ
 ／￣|　　|　|　|
| (￣ヽ＿_ヽ_)__)
＼二つ
*/
