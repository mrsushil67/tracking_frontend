const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.user };
    case "SET_VEHICLELIST":
      return { ...state, vehiclelist: action.payload.vehiclelist };
    case "SET_TOTALVEHICLES":
      return { ...state, totalVehicles: action.payload.totalVehicles };
    case "SET_VEHICLENO" :
      return { ...state, vehicleno: action.payload.vehicleno };
    case "SET_FILTERBYSTATUS":
      return { ...state, filterByStatus: action.payload.filterByStatus };
    case "SET_SHOWDETAILS":
      return { ...state, showDetailed: action.payload.showDetailed };
    case "SET_SHOWVEDIO":
      return { ...state, showVedio: action.payload.showVedio };
    case "SET_PATH_LOADING":
      return { ...state, pathloading: action.payload.pathloading };
    case "SET_PATH":
      return { ...state, path: action.payload.path };
    case "SET_FULLPATH":
      return { ...state, fullPath: action.payload.fullPath };

    default:
      return state;
  }
};

export default reducer;
