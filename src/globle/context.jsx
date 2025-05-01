import React, { useState, createContext, useContext, useReducer } from "react";
import reducer from "./reducer";

const UserContext = createContext();

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {},
  vehiclelist : [], //setVehiclelist
  totalVehicles: 0, //setTotalVehicles
  vehicleno : "", //setVehicleno
  filterByStutus: [], //for filtering vehicles by Current Status
  showDetailed: false,
  showVedio: false,
  pathLoading: false,
  path: [],
  fullPath: [],
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUser = (user) => {
    // console.log("Reducer got the User Data: ", userdata);
    localStorage.setItem("user", JSON.stringify(user));
    return dispatch({
      type: "SET_USER",
      payload: {
        user: user,
      },
    });
  };

  const setVehiclelist = (vehiclelist) => {
    return dispatch({
      type: "SET_VEHICLELIST",
      payload: {
        vehiclelist: vehiclelist,
      }
    })
  }

  const setTotalVehicles = (totalVehicles) => {
    return dispatch({
      type: "SET_TOTALVEHICLES",
      payload: {
        totalVehicles: totalVehicles,
      }
    })
  }

  const setVehicleno = (vehicleno) => {
    return dispatch({
      type: "SET_VEHICLENO",
      payload: {
        vehicleno: vehicleno,
      },
    })
  }

  const setFilterByStatus = (filterByStutus) => {
    return dispatch({
      type: "SET_FILTERBYSTATUS",
      payload: {
        filterByStutus: filterByStutus,
      },
    })
  } 

  const setShowDetailed = (showDetailed) => {
    return dispatch({
      type: "SET_SHOWDETAILS",
      payload: {
        showDetailed: showDetailed,
      },
    });
  };

  const setShowVedio = (showVedio) => {
    return dispatch({
      type: "SET_SHOWVEDIO",
      payload: {
        showVedio: showVedio,
      },
    });
  }

  const setPathLoading = (pathloading) => {
    return dispatch({
      type: "SET_PATH_LOADING",
      payload: {
        pathloading: pathloading,
      },
    });
  }

  const setPath = (path) => {
    return dispatch({
      type: "SET_PATH",
      payload: {
        path: path,
      },
    });
  }

  const setFullPath = (fullPath) => {
    return dispatch({
      type: "SET_FULLPATH",
      payload: {
        fullPath: fullPath,
      },
    });
  }

  return (
    <UserContext.Provider
      value={{
        ...state,
        setUser,
        setVehiclelist,
        setTotalVehicles,
        setVehicleno,
        setFilterByStatus,
        setShowDetailed,
        setShowVedio,
        setPathLoading,
        setPath,
        setFullPath,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useGlobleContext = () => {
  return useContext(UserContext);
};

export { UserContext, UserProvider, useGlobleContext };
