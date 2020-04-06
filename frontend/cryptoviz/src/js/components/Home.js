import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useContext } from "react";
import LosersSection from './LosersSection';
import GainersSection from './GainersSection';
import Navbar from "./Navbar";
import { AuthContext } from "./App";
import Cookies from 'js-cookie';
import Loader from "react-loader-spinner";

function Home() {

  const { state: authState } = useContext(AuthContext);

  return (
    <div>
      {(Cookies.get('user_auth') && authState.isAuthenticated) || (!Cookies.get('user_auth') && !authState.isAuthenticated) ?
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
                <GainersSection />
              </div>
              <div className="tab-pane fade" id="losers">
                <LosersSection />
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
