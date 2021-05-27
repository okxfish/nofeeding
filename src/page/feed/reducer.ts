export const initState = {
  isSidePaneOpen: false,
  currenActivedFeedId: "",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "feed/ById/changeCurrentActivedFeedId":
      return {
        ...state,
        currenActivedFeedId: action.payload,
      };
    default:
      throw new Error();
  }
};
