import React, { useContext } from "react";
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Toggle,
  Stack,
  Separator,
} from "@fluentui/react";

import { FeedThumbnailDisplayType, ViewType } from "../../context/setting";

import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { CHANGE_VIEW_TYPE } from "../../App";
import { SettingContext, DispatchContext } from "../../context";

const ViewSettingPane = () => {
  const {
    layout: { viewType },
    feed: { feedThumbnailDisplayType, unreadOnly },
  } = useContext(SettingContext);
  const dispatch = useContext(DispatchContext);

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
    dispatch({type: 'TOGGLE_UNREAD_ONLY'})
  };

  const onfeedThumbnaillDisplayTypeChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption
  ) => {
    dispatch({
      type: "CHANGE_THUMBNAIL_DISPLAY_TYPE",
      displayType: option?.key,
    });
  };

  const onViewTypeChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption
  ) => {
    dispatch({ type: CHANGE_VIEW_TYPE, viewType: option?.key });
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
        checked={unreadOnly}
      />
      <Separator />
      {viewType !== ViewType.list && (
        <>
          <ChoiceGroup
            selectedKey={feedThumbnailDisplayType}
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
