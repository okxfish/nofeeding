import React from "react";

export enum FeedThumbnailDisplayType {
  alwaysNotDisplay = "ALWAYS_NOT_DISPLAY",
  displayWhenThumbnaillExist = "DISPLAY_WHEN_THUMBNAIL_EXIST",
  alwaysDisplay = "ALWAYS_DISPLAY",
}

export interface FeedSetting {
  feedThumbnailDisplayType?: FeedThumbnailDisplayType | string;
}

export interface subscriptionSetting {
  isIconDisplay: boolean;
}

export interface SettingState {
  feed: FeedSetting;
  subscription: subscriptionSetting;
  layout: {};
  theme: {};
}

export const initSetting:SettingState = {
  feed: {
    feedThumbnailDisplayType: FeedThumbnailDisplayType.alwaysDisplay,
  },
  subscription: {
    isIconDisplay: false
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
