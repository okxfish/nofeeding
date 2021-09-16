import { createModel } from "@rematch/core";
import { RootModel } from './rootModel';

export enum ModalKeys {
    overViewPane = 0,
    addFeedModal,
    viewSettingPane,
    articleModal,
}

type GlobalModal = {
    [modalKey: number]: boolean;
}

export const globalModal = createModel<RootModel>()({
    state: {
        overViewPane: false,
        addFeedModal: false,
        viewSettingPane: false,
        articleModal: false,
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
