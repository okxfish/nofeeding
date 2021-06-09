import React, { useState, useEffect, useContext, useCallback } from "react";
import { default as FeedPage } from "../feed";
import { useWindowSize } from "react-use";
import { ViewType, ViewTypeContext } from "../../context/viewType";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import OverviewPane from "../feed/overviewPane";
import SideBar from "./sideBar";
import HelfScreenPanel from "../../component/halfScreenPanel/halfScreenPanel";
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Toggle,
  Stack,
  Modal,
  Separator,
} from "@fluentui/react";
import queryString from "query-string";
import "./style.css";
import {
  FeedThumbnailDisplayType,
  SettingContext,
  SettingState,
} from "../../context/setting";
import produce from "immer";
import AddFeed from "./AddFeed";

const Home = () => {
  const location = useLocation();
  const [isOverViewPaneOpen, setIsOverViewPaneOpen] = useState<boolean>(false);
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState<boolean>(false);
  const [isViewSettingPaneOpen, setIsViewSettingPaneOpen] =
    useState<boolean>(false);
  const { height: windowHeight } = useWindowSize();
  const { viewType, setViewType } = useContext(ViewTypeContext);
  const { setting, setSetting } = useContext(SettingContext);

  const history = useHistory();

  const closeOverviewPane = (): void => setIsOverViewPaneOpen(false);
  const toggleOverviewPane = (): void => setIsOverViewPaneOpen((isOverViewPaneOpen)=>!isOverViewPaneOpen);

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
      styles: { root: "hidden lg:block flex-1", choiceFieldWrapper: "flex-1" },
    },
  ];

  const feedThumbnaillOptions: IChoiceGroupOption[] = [
    {
      key: FeedThumbnailDisplayType.alwaysDisplay,
      text: "Always Display",
    },
    {
      key: FeedThumbnailDisplayType.alwaysNotDisplay,
      text: "Always Not Display",
    },
    {
      key: FeedThumbnailDisplayType.displayWhenThumbnaillExist,
      text: "Display When Thumbnaill Exist",
    },
  ];

  const onViewTypeChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption
  ) => {
    setViewType(option?.key);
  };

  const onfeedThumbnaillDisplayTypeChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption
  ) => {
    setSetting(
      produce<SettingState>((draft) => {
        draft.feed.feedThumbnailDisplayType = option?.key;
      })
    );
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
    <Stack
      horizontal
      className="overflow-hidden w-full"
      style={{ height: windowHeight }}
    >
      <SideBar
      toggleOverviewPane={toggleOverviewPane}
        setIsOverViewPaneOpen={setIsOverViewPaneOpen}
        setIsViewSettingPaneOpen={setIsViewSettingPaneOpen}
        setIsAddFeedModalOpen={setIsAddFeedModalOpen}
      />
      <FeedPage isOverViewPaneOpen={isOverViewPaneOpen}/>
      <Modal
        isOpen={isAddFeedModalOpen}
        isBlocking={false}
        onDismiss={() => setIsAddFeedModalOpen(false)}
      >
        <AddFeed onCancel={() => setIsAddFeedModalOpen(false)} />
      </Modal>
      <HelfScreenPanel
        isOpen={isOverViewPaneOpen}
        isLightDismiss
        hasCloseButton={false}
        onDismiss={() => setIsOverViewPaneOpen(false)}
        onLightDismissClick={() => setIsOverViewPaneOpen(false)}
        styles={{ content: "p-0" }}
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
          {viewType !== ViewType.list && (
            <>
              <ChoiceGroup
                selectedKey={setting.feed.feedThumbnailDisplayType}
                options={feedThumbnaillOptions}
                onChange={onfeedThumbnaillDisplayTypeChange}
                label="Feed Thumbnail"
                styles={{ label: "mb-2" }}
              />
              <Separator />
            </>
          )}
          <ChoiceGroup
            selectedKey={viewType}
            options={options}
            onChange={onViewTypeChange}
            label="View Type"
            styles={{ label: "mb-2" }}
          />
        </Stack>
      </HelfScreenPanel>
    </Stack>
  );
};

export default Home;
