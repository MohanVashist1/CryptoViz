import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useInterval, createTable } from '../api/common';
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
    trackPromise(getGainers(), areas.gainers);
  }, [gainersTimeInterval]);

  const getGainers = async () => {
    try {
      let response = await fetch(`http://localhost:8000/api/gainers/?time=${gainersTimeInterval}`);
      let data = await response.json();
      if (!response.ok) {
        const error = (data && data.detail) ? data.detail : response.status;
        console.error("There was an error!", error);
        return;
      }
      setGainers(data.gainers);
    } catch(error) {
      console.error("There was an error!", error);
    }
  };

  const timeMapping = {
    "1": "1 Hour",
    "24": "1 Day"
  };

  return (
      <div style={{ textAlign: "center", marginTop: "4em" }}>
        <h1>Top 10 Gainers ({timeMapping[gainersTimeInterval]})</h1>
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
