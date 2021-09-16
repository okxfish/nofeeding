import { createModel } from "@rematch/core";
import { RootModel } from './rootModel';

export enum ScreenPosition {
    Left = 0,
    Center,
    Right,
  }

type App = {
    currenActivedFeedId: string;
    isOverviewPaneOpen: boolean;
    activedScreen: ScreenPosition;
}

export const app = createModel<RootModel>()({
    state: {
        currenActivedFeedId: '',
        isOverviewPaneOpen: false,
        activedScreen: ScreenPosition.Center,
    } as App,
    reducers: {
        changeSelectedArticle(state, payload: string) {
            state.currenActivedFeedId = payload
            return state
        },
        toggleOverviewPane(state, payload: any) {
            state.isOverviewPaneOpen = !state.isOverviewPaneOpen
            return state
        },
        changeActivedScreen(state, screenPosition: ScreenPosition) {
            state.activedScreen = screenPosition
            return state
        },
    }
})