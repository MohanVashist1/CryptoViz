import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Credits from "./Credits";
import Navbar from "./Navbar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";
import CryptoLanding from "./CryptoLanding";
import "../../style/App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/credits" component={Credits}></Route>
          <Route path="/signin" component={SignIn}></Route>
          <Route path="/signup" component={SignUp}></Route>
          <Route path="/crypto/:ticker" component={CryptoLanding}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
