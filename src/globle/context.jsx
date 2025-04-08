import React,{useState, createContext, useContext, useReducer} from 'react'
import reducer from './reducer'

const UserContext = createContext()

const initialState = {
    user : localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {},
    showDetailed : false,

}

const UserProvider = ({children}) => {
    const[state, dispatch] = useReducer(reducer ,initialState)

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

    const setShowDetailed = (showDetailed) => {
        return dispatch({
          type: "SET_SHOWDETAILS",
          payload: {
            showDetailed: showDetailed,
          },
        });
      }
    return(
        <UserContext.Provider
         value={{
            ...state,
            setUser,
            setShowDetailed,
         }}>
            {children}
         </UserContext.Provider>
    )
}

const useGlobleContext = () => {
    return useContext(UserContext)
}

export  {UserContext, UserProvider, useGlobleContext}
