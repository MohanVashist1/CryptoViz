import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useContext } from "react";
import Navbar from "./Navbar";
import { AuthContext } from "./App";
import Loader from "react-loader-spinner";

function InvalidPage() {

  const { state: authState } = useContext(AuthContext);

  return (
    <div>
      {authState.applicationMounted && ((authState.isAuthenticated && Object.keys(authState.user).length > 0) || (!authState.isAuthenticated && Object.keys(authState.user).length === 0)) ?
        <div>
            <Navbar />
            <div style={{ textAlign: "center" }}>
                <h1 style={{ marginTop: "7em" }}>Oops this page doesn't exist...</h1>
            </div>
        </div> :
        <div style={{ textAlign: "center", marginTop: "20em" }}>
          <Loader type="ThreeDots" color="#2BAD60" />
        </div>}
    </div>
  );
}

export default InvalidPage;