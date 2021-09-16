import { createModel } from "@rematch/core";
import { RootModel } from './rootModel';

export enum ModalKeys {
    OverViewPane = 0,
    AddFeedModal,
    ViewSettingPane,
    ArticleModal,
}

type GlobalModal = {
    [modalKey: number]: boolean;
}

export const globalModal = createModel<RootModel>()({
    state: {
        OverViewPane: false,
        AddFeedModal: false,
        ViewSettingPane: false,
        ArticleModal: false,
    } as GlobalModal,
    reducers: {
        openModal(state, modalKey: ModalKeys) {
            return { ...state, [modalKey]: true, }
        },
        closeModal(state, modalKey: ModalKeys) {
            return { ...state, [modalKey]: false, }
        },
    },
})
