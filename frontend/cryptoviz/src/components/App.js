import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Credits from "./Credits";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import CryptoLanding from "./cryptoLanding";
import "../style/App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/credits" component={Credits}></Route>
          <Route path="/crypto/:ticker" component={CryptoLanding}></Route>
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
