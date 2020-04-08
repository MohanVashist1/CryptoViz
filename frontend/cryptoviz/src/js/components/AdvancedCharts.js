import React from "react";
import Navbar from "./Navbar";
import { TVChartContainer } from "../../components/TVChartContainer/index";

function AdvancedLandingPage({ match }) {
  return (
    <div>
      <Navbar />
      <TVChartContainer tickerId={match.params.ticker}></TVChartContainer>
    </div>
  );
}

export default AdvancedLandingPage;
