import { createModel } from "@rematch/core";
import { RootModel } from "./rootModel";

export enum FeedThumbnailDisplayType {
    alwaysNotDisplay = "ALWAYS_NOT_DISPLAY",
    displayWhenThumbnaillExist = "DISPLAY_WHEN_THUMBNAIL_EXIST",
    alwaysDisplay = "ALWAYS_DISPLAY",
}

export enum ViewType {
    list = "LIST",
    magazine = "MAGZ",
    threeway = "3WAY",
    card = "CARD",
}

export enum LineSpace {
    tight = '1.15',
    normal = '1.5',
    wide = '2.25',
}

export enum FeedView {
    LeftCover = 'LEFT_COVER',
    RightCover = 'RIGHT_COVER',
    SocialMedia = 'SOCIAL_MEDIA',
}

type UserInterface = {
    viewType: ViewType;
    isSubscriptionIconDisplay: boolean;
    feedThumbnailDisplayType?: FeedThumbnailDisplayType | string;
    isDarkMode: boolean;
    feedView: FeedView | string,
    readingPreference: {
        fontSize?: string | number;
        lineSpace?: LineSpace | string;
    };
};

export const userInterface = createModel<RootModel>()({
    state: {
        viewType: ViewType.card,
        feedThumbnailDisplayType: FeedThumbnailDisplayType.alwaysNotDisplay,
        isSubscriptionIconDisplay: true,
        isDarkMode: false,
        feedView: FeedView.RightCover,
        readingPreference: {
            fontSize: 16,
            lineSpace: LineSpace.normal,
        },
    } as UserInterface,
    reducers: {
        changeViewType(state, viewType: ViewType) {
            state.viewType = viewType;
            return state;
        },
        changeTheme(state, payload: any) {
            return state;
        },
        changeToDarkTheme(state, payload: any) {
            state.isDarkMode = true;
            return state;
        },
        changeToLightTheme(state, payload: any) {
            state.isDarkMode = false;
            return state;
        },
        changeThumbnailDisplayType(
            state,
            feedThumbnailDisplayType?: FeedThumbnailDisplayType | string
        ) {
            state.feedThumbnailDisplayType =
                feedThumbnailDisplayType ||
                FeedThumbnailDisplayType.alwaysDisplay;
            return state;
        },
        changeArticleFontSize(state, fontSize: number) {
            state.readingPreference.fontSize = fontSize;
            return state;
        },
        changeLineSpace(state, lineSpace: LineSpace | string) {
            state.readingPreference.lineSpace = lineSpace;
            return state;
        },
        changeFeedView(state, feedView: FeedView | string) {
            state.feedView = feedView;
            return state;
        },
    },
});
