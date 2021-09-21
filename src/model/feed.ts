import { createModel } from "@rematch/core";
import { RootModel } from './rootModel';

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

