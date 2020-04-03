import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import LosersSection from './LosersSection';
import GainersSection from './GainersSection';

function Home() {
  return (
    <div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#gainers">Top Gainers</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" data-toggle="tab" href="#losers">Top Losers</a>
        </li>
      </ul>
      <div id="myTabContent" class="tab-content">
        <div class="tab-pane fade" id="gainers" style={{ textAlign: "center", marginTop: "4em" }}>
          <GainersSection />
        </div>
        <div class="tab-pane fade" id="losers" style={{ textAlign: "center", marginTop: "4em" }}>
          <LosersSection />
        </div>
      </div>
    </div>
  );
}

export default Home;
