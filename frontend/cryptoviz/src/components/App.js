import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import "../style/App.css";
import Credits from "./credits";
import Navbar from "./navbar";
import Home from "./home";
import Crypto from "./crypto";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/credits" component={Credits}></Route>
          <Route path="/crypto/:ticker" component={crypto}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
