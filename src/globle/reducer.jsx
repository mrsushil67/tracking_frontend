const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.user };
    case "SET_SHOWDETAILS":
      return { ...state, showDetailed: action.payload.showDetailed };
    case "SET_SHOWVEDIO":
      return { ...state, showVedio: action.payload.showVedio };
    case "SET_PATH":
      return { ...state, path: action.payload.path };
    case "SET_FULLPATH":
      return { ...state, fullPath: action.payload.fullPath };

    default:
      return state;
  }
};

export default reducer;
