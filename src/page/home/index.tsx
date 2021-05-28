import React, { useState, useEffect, useContext, useCallback } from "react";
import { default as FeedPage } from "../feed";
import { useWindowSize } from "react-use";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import OverviewPane from "../feed/overviewPane";
import SideBar from "./sideBar";
import HelfScreenPanel from "../../component/helfScreenPanel/helfScreenPanel";
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Toggle,
  Stack,
  Separator,
} from "@fluentui/react";
import queryString from "query-string";
import "./style.css";

const Home = () => {
  const location = useLocation();
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const [isViewSettingPaneOpen, setIsViewSettingPaneOpen] =
    useState<boolean>(true);
  const { height: windowHeight } = useWindowSize();
  const { viewType, setViewType } = useContext(ViewTypeContext);
  const history = useHistory();

  const closeOverviewPane = (): void => setIsOverViewPaneOpen(false);

  // 切换当前的订阅源的时候关闭订阅源选择菜单
  useEffect(() => {
    closeOverviewPane();
  }, [location.search]);

  const options: IChoiceGroupOption[] = [
    {
      key: ViewType.magazine,
      text: "Magazine",
      iconProps: { iconName: "GridViewMedium" },
      styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
    },
    {
      key: ViewType.list,
      text: "List",
      iconProps: { iconName: "GroupedList" },
      styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
    },
    {
      key: ViewType.threeway,
      text: "Threeway",
      iconProps: { iconName: "ColumnRightTwoThirds" },
      styles: { root: "flex-1", choiceFieldWrapper: "flex-1" },
    },
  ];

  const onViewTypeChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption
  ) => {
    setViewType(option?.key);
  };

  const qs = queryString.parse(location.search);

  const onIsUreadOnlyChange = useCallback(() => {
    history.push({
      pathname: "/feed",
      search: queryString.stringify({
        ...qs,
        unreadOnly: qs["unreadOnly"] === "1" ? "0" : "1",
      }),
    });
  }, [qs, history]);

  return (
    <div
      className="home__layout overflow-hidden"
      style={{ height: windowHeight }}
    >
      <SideBar
        setIsOverViewPaneOpen={setIsOverViewPaneOpen}
        setIsViewSettingPaneOpen={setIsViewSettingPaneOpen}
      />
      <Switch>
        <Route path={["/feed/:options", "/feed"]} component={FeedPage} />
      </Switch>
      <HelfScreenPanel
        isOpen={isOverViewPaneOpen}
        isLightDismiss
        hasCloseButton={false}
        onDismiss={() => setIsOverViewPaneOpen(false)}
        onLightDismissClick={() => setIsOverViewPaneOpen(false)}
      >
        <OverviewPane />
      </HelfScreenPanel>
      <HelfScreenPanel
        isOpen={isViewSettingPaneOpen}
        isLightDismiss
        hasCloseButton={false}
        onDismiss={() => setIsViewSettingPaneOpen(false)}
        onLightDismissClick={() => setIsViewSettingPaneOpen(false)}
      >
        <Stack
          // className="divide-y"
          tokens={{
            childrenGap: "s",
          }}
        >
          <Toggle
            label="Unread Only"
            inlineLabel
            styles={{ label: "flex-1 order-none m-0" }}
            onChange={onIsUreadOnlyChange}
            checked={qs["unreadOnly"] === "0"}
          />
          <Separator />
          <ChoiceGroup
            selectedKey={viewType}
            options={options}
            onChange={onViewTypeChange}
            label="View Type"
            styles={{ label: "mb-2" }}
          />
        </Stack>
      </HelfScreenPanel>
    </div>
  );
};

export default Home;
