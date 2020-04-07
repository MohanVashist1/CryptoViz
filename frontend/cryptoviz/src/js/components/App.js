import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, createContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Cookies from "js-cookie";
import Credits from "./Credits";
import Navbar from "./Navbar";
import Alert from "./Alert";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Watchlist from "./Watchlist";
import Home from "./Home";
import CryptoLanding from "./CryptoLanding";
import { useInterval } from "../common";
import { getCurrUser } from "../api";
import { reducer } from "../reducer"
import "../../style/App.css";
import { GET_USER_SUCCESS, GET_USER_FAILURE, ERROR_CLOSE } from "../constants/auth";
import { TVChartContainer } from "../../components/TVChartContainer/index";

export const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: {},
  error: "",
};

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    getUserInfo();
  }, []);

  useInterval(() => {
    getUserInfo();
  }, 500);

  const getUserInfo = () => {
    if (Cookies.get("user_auth")) {
      getCurrUser()
        .then((res) => {
          dispatch({
            type: GET_USER_SUCCESS,
            payload: {
              user: res,
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: GET_USER_FAILURE,
          });
          console.error("There was an error!", error);
        });
    } else {
      dispatch({
        type: GET_USER_FAILURE,
      });
    }
  };

  const handleCloseError = () => {
    dispatch({
      type: ERROR_CLOSE
    });
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <div className="App">
        <Alert msg = {state.error} show = {state.error ? true : false} onHide = {handleCloseError} />
        <BrowserRouter>
          {/* <Navbar /> */}
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/credits" component={Credits}></Route>
            <Route path="/signin" component={SignIn}></Route>
            <Route path="/signup" component={SignUp}></Route>
            <Route
              path="/crypto/:ticker"
              exact
              component={CryptoLanding}
            ></Route>
            <Route
              path="/crypto/advanced/:ticker"
              component={TVChartContainer}
            ></Route>
            <Route path="/watchlist" component={Watchlist}></Route>
          </Switch>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
