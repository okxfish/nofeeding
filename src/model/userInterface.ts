import { createModel } from "@rematch/core";
import { RootModel } from './rootModel';

export enum FeedThumbnailDisplayType {
    alwaysNotDisplay = "ALWAYS_NOT_DISPLAY",
    displayWhenThumbnaillExist = "DISPLAY_WHEN_THUMBNAIL_EXIST",
    alwaysDisplay = "ALWAYS_DISPLAY",
}

export enum ViewType {
    list = 'LIST',
    magazine = 'MAGZ',
    threeway = '3WAY',
    card = 'CARD',
}

type UserInterface = {
    viewType: ViewType;
    isSubscriptionIconDisplay: boolean;
    feedThumbnailDisplayType?: FeedThumbnailDisplayType | string;
    isDarkMode: boolean;
}

export const userInterface = createModel<RootModel>()({
    state: {
        viewType: ViewType.card,
        feedThumbnailDisplayType: FeedThumbnailDisplayType.alwaysNotDisplay,
        isSubscriptionIconDisplay: true,
        isDarkMode: false,
    } as UserInterface,
    reducers: {
        changeViewType(state, viewType: ViewType) {
            state.viewType = viewType
            return state
        },
        changeTheme(state, payload: any) {
            return state
        },
        changeToDarkTheme(state, payload: any) {
            state.isDarkMode = true
            return state
        },
        changeToLightTheme(state, payload: any) {
            state.isDarkMode = false
            return state
        },
        changeThumbnailDisplayType(state, feedThumbnailDisplayType: FeedThumbnailDisplayType) {
            state.feedThumbnailDisplayType = feedThumbnailDisplayType
            return state
        },
    },
})
