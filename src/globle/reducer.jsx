const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.user };
    case "SET_SHOWDETAILS":
      return { ...state, showDetailed: action.payload.showDetailed };
    case "SET_SHOWVEDIO":
      return { ...state, showVedio: action.payload.showVedio };

    default:
      return state;
  }
};

export default reducer;
