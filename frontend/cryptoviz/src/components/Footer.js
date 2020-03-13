import "bootswatch/dist/lux/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import "../style/footer.css";

function Footer() {
  return (
    <footer>
      <div class = "credits">
        <Link to="/credits">Credits</Link>
      </div>
    </footer>
  );
}
export default Footer;