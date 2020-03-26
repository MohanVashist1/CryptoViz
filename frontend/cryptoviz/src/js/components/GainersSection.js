import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useInterval } from './Api';
import { trackPromise } from 'react-promise-tracker';
import { Spinner } from './Spinner';
import { areas } from '../constants/areas';

function GainersSection() {
  const [gainersTimeInterval, setGainersTimeInterval] = useState("1");
  const [gainers, setGainers] = useState([]);

  useInterval(() => {
    getGainers();
  }, 30000);

  useEffect(() => {
    setGainers([]);
    getGainers();
  }, [gainersTimeInterval]);

  const getGainers = () => {
    trackPromise(
    fetch(`http://localhost:8000/api/gainers/?time=${gainersTimeInterval}`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.detail) ? data.detail : response.status;
          return Promise.reject(error);
        }
        setGainers(data.gainers);
      })
      .catch(error => {
        console.error("There was an error!", error);
      }), areas.gainers);
  };

  const timeMapping = {
    "1": "1 Hour",
    "24": "1 Day"
  };

  const createTable = data => {
    let rows = [];
    let rowClass = "table-primary";
    let cells = [];
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      cells.push(
        <td key={count}>
          <Link to={`/crypto/${data[i].symbol}USDT/`}>{data[i].rank}</Link>
        </td>
      );
      cells.push(
        <td key={count + 1}>
          <Link to={`/crypto/${data[i].symbol}USDT/`}>{data[i].symbol}</Link>
        </td>
      );
      cells.push(
        <td key={count + 2}>
          <Link to={`/crypto/${data[i].symbol}USDT/`}>
            {data[i].market_cap}
          </Link>
        </td>
      );
      cells.push(
        <td key={count + 3}>
          <Link to={`/crypto/${data[i].symbol}USDT/`}>{data[i].price}</Link>
        </td>
      );
      cells.push(
        <td key={count + 4}>
          <Link to={`/crypto/${data[i].symbol}USDT/`}>{data[i].volume}</Link>
        </td>
      );
      rows.push(
        <tr key={count + 5} className={rowClass}>
          {cells}
        </tr>
      );
      rowClass =
        rowClass === "table-primary" ? "table-secondary" : "table-primary";
      count += 6;
      cells = [];
    }
    return rows;
  };

  return (
      <div style={{ textAlign: "center", marginTop: "2em" }}>
        {/* <div style={{ display: "flex", margin: "0", alignItems: "center", justifyContent: "space-around" }}>
          {!currUser &&
            <button type="button" className="btn btn-outline-primary" onClick = {() => {history.push('/signin');}}>Sign In</button>}
          {currUser &&
            <div style={{visibility: "hidden"}}>
              <h6>Hi, {currUser}!</h6>
              <button type="button" className="btn btn-outline-primary">Logout</button>
            </div>} */}
          <h1>Top 10 Gainers ({timeMapping[gainersTimeInterval]})</h1>
          {/* {!currUser &&
            <button type="button" className="btn btn-outline-primary" onClick = {() => {history.push('/signup');}}>Sign Up</button>}
          {currUser &&
            <div>
              <h6>Hi, {currUser}!</h6>
              <button type="button" className="btn btn-outline-primary" onClick = {logout}>Logout</button>
            </div>}
        </div> */}
        <div style={{ marginTop: "2em" }}>
          <div
            className="btn-group"
            role="group"
            aria-label="Button group with nested dropdown"
          >
            <button type="button" className="btn btn-primary">
              Select Time Interval
            </button>
            <div className="btn-group" role="group">
              <button
                id="btnGroupDrop1"
                type="button"
                className="btn btn-primary dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              ></button>
              <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setGainersTimeInterval("1");
                  }}
                >
                  {timeMapping["1"]}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setGainersTimeInterval("24");
                  }}
                >
                  {timeMapping["24"]}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ margin: "auto", padding: "30px", width: "80%" }}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Symbol</th>
                <th scope="col">Market Cap</th>
                <th scope="col">Price</th>
                <th scope="col">Volume</th>
              </tr>
            </thead>
            <tbody>{createTable(gainers)}</tbody>
          </table>
          <Spinner area={areas.gainers}/>
        </div>
      </div>
  );
}

export default GainersSection;
