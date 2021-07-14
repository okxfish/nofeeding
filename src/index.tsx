import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeIcons } from "@fluentui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { default as dayjs } from "dayjs";
import { default as relativeTime } from "dayjs/plugin/relativeTime";
import { default as localizedFormat } from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/zh-cn' // 导入本地化语言

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

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
