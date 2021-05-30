import React from "react";

export enum FeedThumbnailDisplayType {
  alwaysNotDisplay = "ALWAYS_NOT_DISPLAY",
  displayWhenThumbnaillExist = "DISPLAY_WHEN_THUMBNAIL_EXIST",
  alwaysDisplay = "ALWAYS_DISPLAY",
}

export interface FeedSetting {
  feedThumbnailDisplayType?: FeedThumbnailDisplayType | string;
}

export interface Setting {
  feed: FeedSetting;
  layout: {};
  theme: {};
}

export interface SettingState {
  feed: FeedSetting;
  layout: {};
  theme: {};
}

export const initSetting:SettingState = {
  feed: {
    feedThumbnailDisplayType: FeedThumbnailDisplayType.alwaysDisplay,
  },
  layout: {},
  theme: {},
};

export const SettingContext =
  React.createContext<{
    setting: SettingState;
    setSetting: React.Dispatch<React.SetStateAction<SettingState>>;
  }>({
    setting:initSetting,
    setSetting: ()=>{}
  });
