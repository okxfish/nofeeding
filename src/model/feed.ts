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

type Feed = {
    unreadOnly: boolean;
}

export const feed = createModel<RootModel>()({
    state: {
        unreadOnly: true,
    } as Feed,
    reducers: {
        toggleIsUnreadOnly(state, payload: any){
            state.unreadOnly = !state.unreadOnly
            return state
        },
    },
})

