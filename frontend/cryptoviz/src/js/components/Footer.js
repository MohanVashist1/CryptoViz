import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import "../../style/footer.css";
import "../../style/main.css";

function Footer() {
  return (
    <footer>
      <div className = "uppercase">
        <Link to="/credits">Credits</Link>
      </div>
    </footer>
  );
}

export default Footer;