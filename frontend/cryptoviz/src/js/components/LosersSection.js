import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useInterval, createTable } from './Api';
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
    trackPromise(getLosers(), areas.losers);
  }, [losersTimeInterval]);

  const getLosers = async () => {
    try {
      let response = await fetch(`http://localhost:8000/api/losers/?time=${losersTimeInterval}`);
      let data = await response.json();
      if (!response.ok) {
        const error = (data && data.detail) ? data.detail : response.status;
        console.error("There was an error!", error);
        return;
      }
      setLosers(data.losers);
    } catch(error) {
      console.error("There was an error!", error);
    }
  };

  const timeMapping = {
    "1": "1 Hour",
    "24": "1 Day"
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
