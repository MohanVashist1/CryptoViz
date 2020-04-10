import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, createContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Credits from "./Credits";
import Alert from "./Alert";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Watchlist from "./Watchlist";
import Home from "./Home";
import InvalidPage from "./InvalidPage";
import CryptoLanding from "./CryptoLanding";
import { useInterval } from "../common";
import { getCurrUser } from "../api";
import { reducer } from "../reducer";
import "../../style/App.css";
import {
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  ERROR_CLOSE,
  APPLICATION_MOUNTED,
} from "../constants/auth";
// import AdvancedLandingPage from "./AdvancedCharts";
export const AuthContext = createContext();

const initialState = {
  applicationMounted: false,
  isAuthenticated: false,
  user: {},
  error: "",
};

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    getUserInfo();
    dispatch({
      type: APPLICATION_MOUNTED,
    });
  }, []);

  useInterval(() => {
    getUserInfo();
  }, 500);

  const getUserInfo = () => {
    if (!state.applicationMounted || state.isAuthenticated) {
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
      type: ERROR_CLOSE,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <div className="App">
        <Alert
          msg={state.error}
          show={state.error ? true : false}
          onHide={handleCloseError}
        />
        <BrowserRouter>
          {/* <Navbar /> */}
          <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/credits" exact component={Credits}></Route>
            <Route path="/signin" exact component={SignIn}></Route>
            <Route path="/signup" exact component={SignUp}></Route>
            <Route
              path="/crypto/:ticker"
              exact
              component={CryptoLanding}
            ></Route>
            {/* <Route
              path="/crypto/advanced/:ticker"
              exact
              component={AdvancedLandingPage}
            ></Route> */}
            <Route path="/watchlist" exact component={Watchlist}></Route>
            <Route path="*" component={InvalidPage}></Route>
          </Switch>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
