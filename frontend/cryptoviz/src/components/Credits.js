import React from "react";
import "../style/main.css";

function Credits() {
  return (
    <div>
    <div className="container-fluid">
      <h3>Developed By:</h3>
      <ul>
        <li>
          <a href="https://github.com/mrigankmg" title="Mrigank Mehta">
            Mrigank Mehta
          </a>{" "}
        </li>
        <li>
          <a href="https://github.com/MohanVashist1" title="Mohan Vashisht">
            Mohan Vashisht
          </a>
        </li>
      </ul>
    </div>
    <div className="container-fluid">
      <h3>Icons made by:</h3>
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
    <div className="container-fluid">
    <h3>What would we do without:{" "}</h3>
    <ul>
      <li>
        <a href="https://www.stackoverflow.com" title="Stack Overflow">
          Stack Overflow
        </a>
      </li>
      <li>
        <a href="https://www.w3schools.com/" title="W3Schools">
          W3Schools
        </a>
      </li>
    </ul>
  </div>
  </div>
  );
}

export default Credits;
