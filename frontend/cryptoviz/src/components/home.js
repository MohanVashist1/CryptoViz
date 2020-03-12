import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import "../style/App.css";

function Home() {
  return (
    <div>
      <Link to="/credits">credits</Link>
    </div>
  );
}
export default Home;
