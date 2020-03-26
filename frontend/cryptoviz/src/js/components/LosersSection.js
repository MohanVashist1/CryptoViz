import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useInterval } from './Api';
import { trackPromise } from 'react-promise-tracker';
import { Spinner } from './Spinner';
import { areas } from '../constants/areas';

function LosersSection() {
  const [losersTimeInterval, setLosersTimeInterval] = useState("1");
  const [losers, setLosers] = useState([]);

  useInterval(() => {
    getLosers();
  }, 30000);
  
  useEffect(() => {
    setLosers([]);
    getLosers();
  }, [losersTimeInterval]);

  const getLosers = () => {
    trackPromise(
    fetch(`http://localhost:8000/api/losers/?time=${losersTimeInterval}`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.detail) ? data.detail : response.status;
          return Promise.reject(error);
        }
        setLosers(data.losers);
      })
      .catch(error => {
        console.error("There was an error!", error);
      }), areas.losers);
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
      <div style={{ textAlign: "center" }}>
        <h1>Top 10 Losers ({timeMapping[losersTimeInterval]})</h1>
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
                id="btnGroupDrop2"
                type="button"
                className="btn btn-primary dropdown-toggle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              ></button>
              <div className="dropdown-menu" aria-labelledby="btnGroupDrop2">
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setLosersTimeInterval("1");
                  }}
                >
                  {timeMapping["1"]}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setLosersTimeInterval("24");
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
            <tbody>{createTable(losers)}</tbody>
          </table>
          <Spinner area={areas.losers}/>
        </div>
      </div>
  );
}

export default LosersSection;
