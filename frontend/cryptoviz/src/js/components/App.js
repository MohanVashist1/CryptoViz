import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, createContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Cookies from 'js-cookie';
import Credits from "./Credits";
import Navbar from "./Navbar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Watchlist from "./Watchlist";
import Home from "./Home";
import CryptoLanding from "./CryptoLanding";
import { useInterval } from '../api/common';
import "../../style/App.css";
import  * as authConstants from '../constants/auth';

export const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: {},
  error: ""
};

const reducer = (state, action) => {
  switch (action.type) {
    case authConstants.UPDATE_USER_FAILURE:
    case authConstants.LOGOUT_FAILURE:
    case authConstants.LOGIN_FAILURE:
    case authConstants.REGISTER_FAILURE:
      return {
        ...state,
        error: action.payload.error
      };
    case authConstants.GET_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case authConstants.UPDATE_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        error: ""
      };
    case authConstants.ERROR_CLOSE:
    case authConstants.REGISTER_SUCCESS:
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        error: ""
      };
    // case authConstants.GET_USER_FAILURE:
    //   return {
    //     ...state,
    //     user: {},
    //     error: action.payload.error
    //   };
    case authConstants.LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
        error: ""
      };
    case authConstants.GET_USER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: {}
      };
    default:
      return state;
  }
};

function App() {

  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    getCurrUser();
  }, []);

  useInterval(() => {
    getCurrUser();
  }, 500);

  const getCurrUser = async () => {
    if (Cookies.get('user_auth')) {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('user_auth')
        },
        body: null
      };
      try {
        let response = await fetch('http://localhost:8000/api/users/me', requestOptions);
        let data = await response.json();
        if (!response.ok) {
          const error = (data && data.detail) ? data.detail : response.status;
          dispatch({
            type: authConstants.GET_USER_FAILURE,
            // payload: {
            //   error: error
            // }
          });
          console.error("There was an error!", error);
          return;
        }
        dispatch({
          type: authConstants.GET_USER_SUCCESS,
          payload: {
            user: data
          }
        });
      } catch(error) {
        dispatch({
          type: authConstants.GET_USER_FAILURE,
        //   payload: {
        //     error: error
        //   }
        });
        console.error("There was an error!", error);
      }
    } else {
      dispatch({
        type: authConstants.GET_USER_FAILURE
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <div className="App">
        <BrowserRouter>
          {/* <Navbar /> */}
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/credits" component={Credits}></Route>
            <Route path="/signin" component={SignIn}></Route>
            <Route path="/signup" component={SignUp}></Route>
            <Route path="/watchlist" component={Watchlist}></Route>
            <Route path="/crypto/:ticker" component={CryptoLanding}></Route>
          </Switch>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
