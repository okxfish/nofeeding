import React from "react";

export enum ViewType {
  list = 'LIST',
  magazine = 'MAGZ',
  threeway = '3WAY',
  card = 'CARD',
}

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
  layout: {
    viewType: ViewType;
  };
  theme: {};
}

export const initSetting:SettingState = {
  feed: {
    feedThumbnailDisplayType: FeedThumbnailDisplayType.alwaysNotDisplay,
  },
  subscription: {
    isIconDisplay: false
  },
  layout: {
    viewType: ViewType.card
  },
  theme: {},
};

export const SettingContext =
  React.createContext<SettingState>(initSetting);
