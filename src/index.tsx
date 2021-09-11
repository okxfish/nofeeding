import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeIcons } from "@fluentui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { default as dayjs } from "dayjs";
import { default as relativeTime } from "dayjs/plugin/relativeTime";
import { default as localizedFormat } from "dayjs/plugin/localizedFormat";
import "dayjs/locale/zh-cn"; // 导入本地化语言

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const queryClient = new QueryClient();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

// const registerServiceWork = async () => {
//   if ("serviceWorker" in window.navigator) {
//     console.log("Service worker registration ing:");
//     try {
//       const registration = await navigator.serviceWorker.register("/sw.js", {
//         scope: "/",
//       });
//       console.log("Service worker registration succeeded:", registration);
//     } catch (error) {}
//   }
// };

// registerServiceWork();

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
