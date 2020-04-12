import React, { useContext } from "react";
import Navbar from "./Navbar";
import { AuthContext } from "./App";
import { TVChartContainer } from "../../components/TVChartContainer/index";
import Loader from "react-loader-spinner";
import Cookie from 'js-cookie';

function AdvancedLandingPage({ match }) {

  const { state: authState } = useContext(AuthContext);

  return (
    <>
    {(Cookie.get('isLoggedIn') && Cookie.get('isLoggedIn').toLowerCase() === 'true' && authState.isAuthenticated) ||
      ((!Cookie.get('isLoggedIn') || Cookie.get('isLoggedIn').toLowerCase() === 'false') && !authState.isAuthenticated) ?
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
