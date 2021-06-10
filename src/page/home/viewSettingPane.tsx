import React, { useContext } from "react";
import produce from "immer";
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Toggle,
  Stack,
  Separator,
} from "@fluentui/react";

import {
  FeedThumbnailDisplayType,
  SettingContext,
  SettingState,
} from "../../context/setting";
import { ViewType, ViewTypeContext } from "../../context/viewType";

import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

const ViewSettingPane = () => {
  const { setting, setSetting } = useContext(SettingContext);
  const { viewType, setViewType } = useContext(ViewTypeContext);

  const history = useHistory();
  const location = useLocation();
  
  const qs = queryString.parse(location.search);
  const { unreadOnly } = qs;

  const viewTypeOptions: IChoiceGroupOption[] = [
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
      styles: {
        root: "hidden lg:block flex-1",
        choiceFieldWrapper: "flex-1",
      },
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

  const onIsUreadOnlyChange = () => {
    history.push({
      pathname: "/feed",
      search: queryString.stringify({
        ...qs,
        unreadOnly: unreadOnly === "1" ? "0" : "1",
      }),
    });
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

  const onViewTypeChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption
  ) => {
    setViewType(option?.key);
  };

  return (
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
        checked={unreadOnly === "0"}
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
        options={viewTypeOptions}
        onChange={onViewTypeChange}
        label="View Type"
        styles={{ label: "mb-2" }}
      />
    </Stack>
  );
};

export default ViewSettingPane;
