import React, { useContext } from "react";
import "../../style/main.css";
import Navbar from "./Navbar";
import { AuthContext } from "./App";
import Loader from "react-loader-spinner";
import Cookie from 'js-cookie';

function Credits() {

  const { state: authState } = useContext(AuthContext);

  return (
    <div>
      {(Cookie.get('isLoggedIn') && Cookie.get('isLoggedIn').toLowerCase() === 'true' && authState.isAuthenticated) ||
      ((!Cookie.get('isLoggedIn') || Cookie.get('isLoggedIn').toLowerCase() === 'false') && !authState.isAuthenticated) ?
      <div>
        <Navbar />
        <div className="container-fluid">
          <h3>Developed By:</h3>
          <ul>
            <li>
              <a href="https://github.com/mrigankmg" title="Mrigank Mehta">
                Mrigank Mehta
              </a>
            </li>
            <li>
              <a href="https://github.com/MohanVashist1" title="Mohan Vashisht">
                Mohan Vashisht
              </a>
            </li>
          </ul>
        </div>
        <div className="container-fluid">
          <h3>Icons made by:</h3>
          <ul>
            <li>
              <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">
                Vitaly Gorbachev
              </a>{" "}
              from{" "}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </li>
          </ul>
        </div>
        <div className="container-fluid">
        <h3>What would we do without:</h3>
        <ul>
          <li>
            <a href="https://www.stackoverflow.com" title="Stack Overflow">
              Stack Overflow
            </a>
          </li>
          <li>
            <a href="https://www.w3schools.com/" title="W3Schools">
              W3Schools
            </a>
          </li>
          <li>
            <a href="https://bootswatch.com/lux/" title="Bootswatch">
              Bootswatch (Example Code)
            </a>
          </li>
        </ul>
      </div>
    </div>  :
    <div style={{ textAlign: "center", marginTop: "20em" }}>
      <Loader type="ThreeDots" color="#2BAD60" />
    </div>}
  </div>
  );
}

export default Credits;
