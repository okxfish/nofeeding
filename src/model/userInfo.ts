import { createModel } from "@rematch/core";
import { RootModel } from "./rootModel";

type UserInfo = {
    userId?: string | null;
    userName?: string | null;
    userEmail?: string | null;
};

export const userInfo = createModel<RootModel>()({
    state: {
        userId: null,
    } as UserInfo,
    reducers: {
        fetchedUserInfo(state, userInfo: UserInfo) {
            state.userId = userInfo.userId;
            state.userName = userInfo.userName;
            state.userEmail = userInfo.userEmail;
            return state;
        },
    },
});
