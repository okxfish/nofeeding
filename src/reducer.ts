import {
  FeedThumbnailDisplayType,
  initSetting,
  SettingState,
  ViewType,
} from "./context/setting";

export enum ModalKeys {
  OverViewPane = 0,
  AddFeedModal,
  ViewSettingPane,
}

export enum ScreenPosition {
  Left = 0,
  Center,
  Right,
}

interface Store {
  currenActivedFeedId: string;
  isArticleModalOpen: boolean;
  isOverviewPaneOpen: boolean;
  activedScreen: ScreenPosition;
  modals: {
    [modalKey: number]: boolean;
  };
  setting: SettingState;
}

type Action =
  | { type: "CHANGE_SELECTED_ARTICLE"; articleId: string }
  | { type: "CHANGE_VIEW_TYPE"; viewType: ViewType }
  | { type: "OPEN_AIRTICLE_MODAL" | "CLOSE_AIRTICLE_MODAL" }
  | { type: "OPEN_MODAL" | "CLOSE_MODAL"; modalKey: ModalKeys }
  | { type: "TOGGLE_UNREAD_ONLY" }
  | { type: "TOGGLE_OVERVIEW_PANE" }
  | { type: "TOGGLE_DARK_THEME" }
  | { type: "CHANGE_TO_DARK_THEME" }
  | { type: "CHANGE_TO_LIGHT_THEME" }
  | { type: "CHANGE_SCREEN_POSITION", position: ScreenPosition}
  | {
      type: "CHANGE_THUMBNAIL_DISPLAY_TYPE";
      displayType: FeedThumbnailDisplayType;
    };

export const getInitSetting = (): SettingState => {
  let result: SettingState = initSetting;
  try {
    const localSetting: string | null = localStorage.getItem("setting");
    if (localSetting) {
      result = JSON.parse(localSetting);
    }
  } catch (error) {
    console.error(error);
  }
  return result;
};

export const reducer = (prevState: Store, action: Action) => {
  switch (action.type) {
    case "CHANGE_SELECTED_ARTICLE":
      return { ...prevState, currenActivedFeedId: action.articleId };
    case "CHANGE_VIEW_TYPE":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          layout: {
            ...prevState.setting.layout,
            viewType: action.viewType,
          },
        },
      };
    case "OPEN_AIRTICLE_MODAL":
      return { ...prevState, isArticleModalOpen: true };
    case "CLOSE_AIRTICLE_MODAL":
      return { ...prevState, isArticleModalOpen: false };
    case "CHANGE_THUMBNAIL_DISPLAY_TYPE":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          feed: {
            ...prevState.setting.feed,
            feedThumbnailDisplayType: action.displayType,
          },
        },
      };
    case "TOGGLE_UNREAD_ONLY":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          feed: {
            ...prevState.setting.feed,
            unreadOnly: !prevState.setting.feed.unreadOnly,
          },
        },
      };
    case "TOGGLE_DARK_THEME":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          isDarkMode: !prevState.setting.isDarkMode,
        },
      };
    case "TOGGLE_OVERVIEW_PANE":
      return {
        ...prevState,
        isOverviewPaneOpen: !prevState.isOverviewPaneOpen,
      };
    case "CHANGE_TO_DARK_THEME":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          isDarkMode: true,
        },
      };
    case "CHANGE_TO_LIGHT_THEME":
      return {
        ...prevState,
        setting: {
          ...prevState.setting,
          isDarkMode: false,
        },
      };
    case "CHANGE_SCREEN_POSITION":
      return {
        ...prevState,
        activedScreen: action.position,
      };
    case "OPEN_MODAL":
      return {
        ...prevState,
        modals: {
          ...prevState.modals,
          [action.modalKey]: true,
        },
      };
    case "CLOSE_MODAL":
      return {
        ...prevState,
        modals: {
          ...prevState.modals,
          [action.modalKey]: false,
        },
      };
    default:
      return { ...prevState };
  }
};
