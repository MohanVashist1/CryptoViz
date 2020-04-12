import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useContext } from "react";
import Table from './Table';
import Navbar from "./Navbar";
import { AuthContext } from "./App";
import Loader from "react-loader-spinner";
import Cookie from 'js-cookie';

function Home() {

  const { state: authState } = useContext(AuthContext);

  return (
    <div>
      {(Cookie.get('isLoggedIn') && Cookie.get('isLoggedIn').toLowerCase() === 'true' && authState.isAuthenticated) ||
      ((!Cookie.get('isLoggedIn') || Cookie.get('isLoggedIn').toLowerCase() === 'false') && !authState.isAuthenticated) ?
        <div>
        <Navbar />
          <div>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#gainers">Top Gainers</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#losers">Top Losers</a>
              </li>
            </ul>
            <div id="myTabContent" className="tab-content">
              <div className="tab-pane fade active show" id="gainers">
                <Table isGainer={true}/>
              </div>
              <div className="tab-pane fade" id="losers">
                <Table isGainer={false}/>
              </div>
            </div>
          </div>
        </div> :
        <div style={{ textAlign: "center", marginTop: "20em" }}>
          <Loader type="ThreeDots" color="#2BAD60" />
        </div>}
    </div>
  );
}

export default Home;
