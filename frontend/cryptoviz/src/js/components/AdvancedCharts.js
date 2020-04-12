import React from "react";
import Navbar from "./Navbar";
import { TVChartContainer } from "../../components/TVChartContainer/index";
import Loader from "react-loader-spinner";
import Cookie from 'js-cookie';

function AdvancedLandingPage({ match }) {
  return (
    <>
    {(Cookie.get('isLoggedIn') && Cookie.get('isLoggedIn').toLocaleLowerCase() === 'true' && authState.isAuthenticated) ||
      ((!Cookie.get('isLoggedIn') || Cookie.get('isLoggedIn').toLocaleLowerCase() === 'false') && !authState.isAuthenticated) ?
      <div>
        <Navbar />
        <TVChartContainer tickerId={match.params.ticker}></TVChartContainer>
      </div> :
      <div style={{ textAlign: "center", marginTop: "20em" }}>
        <Loader type="ThreeDots" color="#2BAD60" />
      </div>}
    </>
  );
}

export default AdvancedLandingPage;
