import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import LosersSection from './LosersSection';
import GainersSection from './GainersSection';

function Home() {
  return (
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
        <div className="tab-pane fade active show" id="gainers" style={{ textAlign: "center", marginTop: "4em" }}>
          <GainersSection />
        </div>
        <div className="tab-pane fade" id="losers" style={{ textAlign: "center", marginTop: "4em" }}>
          <LosersSection />
        </div>
      </div>
    </div>
  );
}

export default Home;
