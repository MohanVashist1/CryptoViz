import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useState, useContext } from "react";
import { useHistory, Link, NavLink } from "react-router-dom";
import { LOGOUT_SUCCESS, LOGOUT_FAILURE } from '../constants/auth';
import "../../style/navbar.css";
import { logout } from '../api';
import { AuthContext } from "./App";

function Navbar() {

  const { state: authState, dispatch } = useContext(AuthContext);
  const history = useHistory();
  const [crypto, setCrypto] = useState("");

  const signOut = () => {
    logout().then(() => {
      dispatch({
        type: LOGOUT_SUCCESS
      });
      history.push('/');
    }).catch(error => {
      dispatch({
        type: LOGOUT_FAILURE,
        payload: {
          error: error
        }
      });
      console.error("There was an error!", error);
    });
  };

  const handleSearch = e => {
    history.push(`/crypto/${crypto}`);
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="navbar-brand" style={{ display: "flex", alignItems: "center", flexFlow: "column", justifyContent: "center" }}>
          <Link to="/" className="logo" style={{ marginBottom: "0.25em"}}/>
          <NavLink to="/" className="nav-link" style={{ marginTop: "0.25em", color: "white" }}>
            CryptoViz
          </NavLink>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" activeClassName="active">
                Home
              </NavLink>
            </li>
            {authState.isAuthenticated &&
              <li className="nav-item">
              <NavLink to="/watchlist" className="nav-link" activeClassName="active">
                My Watchlist
              </NavLink>
            </li>}
            <li className="nav-item">
              <NavLink to="/credits" className="nav-link" activeClassName="active">
                Credits
              </NavLink>
            </li>
          </ul>
          {!authState.isAuthenticated ?
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/signin" className="nav-link" activeClassName="active">
                Sign In
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup" className="nav-link" activeClassName="active">
                Sign Up
              </NavLink>
            </li>
          </ul> :
          <ul className="navbar-nav">
            <li className="nav-item" style={{display: "flex", flexFlow: "column", alignItems: "center", justifyContent: "center"}}>
              <p style={{color: "rgba(255,255,255,0.5)"}}>Hi, {authState.user.first_name}!</p>
              <a href="#" className="nav-link" onClick={signOut}>Sign Out</a>
            </li>
          </ul>}
          <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
            <input
              className="form-control mr-sm-2"
              type="text"
              placeholder="Search"
              onChange={e => setCrypto(e.target.value)}
            ></input>
            <button className="btn btn-secondary my-2 my-sm-0" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
