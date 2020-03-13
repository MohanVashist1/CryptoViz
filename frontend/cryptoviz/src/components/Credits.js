import React from "react";
import "../style/main.css";

function Credits() {
  return (
    <div className="container-fluid">
      <h3>Icons made by:{" "}</h3>
      <ul>
        <li>
          <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">
            Vitaly Gorbachev
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Credits;
