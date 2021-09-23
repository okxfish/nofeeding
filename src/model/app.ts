import { createModel } from "@rematch/core";
import { RootModel } from './rootModel';

export enum ScreenPosition {
    Left = 0,
    Center,
    Right,
  }

type App = {
    isOverviewPaneOpen: boolean;
    activedScreen: ScreenPosition;
}

export const app = createModel<RootModel>()({
    state: {
        isOverviewPaneOpen: true,
        activedScreen: ScreenPosition.Center,
    } as App,
    reducers: {
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