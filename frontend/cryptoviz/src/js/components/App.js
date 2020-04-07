import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, createContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Cookies from "js-cookie";
import Credits from "./Credits";
import Navbar from "./Navbar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";
import CryptoLanding from "./CryptoLanding";
import { useInterval } from "../api/common";
import "../../style/App.css";
import { TVChartContainer } from "../../components/TVChartContainer/index";

export const AuthContext = createContext();

const initialState = {
  user: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        user: {},
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
  }, 1000);

  const getCurrUser = async () => {
    if (Cookies.get("user_auth")) {
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("user_auth"),
        },
        body: null,
      };
      try {
        let response = await fetch(
          "http://localhost:8000/api/users/me",
          requestOptions
        );
        let data = await response.json();
        if (!response.ok) {
          const error = data && data.detail ? data.detail : response.status;
          dispatch({
            type: "LOGOUT",
          });
          console.error("There was an error!", error);
          return;
        }
        dispatch({
          type: "LOGIN",
          payload: {
            user: data,
          },
        });
      } catch (error) {
        dispatch({
          type: "LOGOUT",
        });
        console.error("There was an error!", error);
      }
    } else {
      dispatch({
        type: "LOGOUT",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <div className="App">
        <BrowserRouter>
          <Navbar />
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
          </Switch>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
