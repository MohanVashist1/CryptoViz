import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Brush,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

var conn = new WebSocket(`ws://localhost:8000/api/crypto/`);

function CryptoLanding({ match }) {
  const data1 = [
    {
      timestamp: "2020-03-15 02:38:00",
      close: 5217.2,
      rsi: 72.3606560103,
      ema: 5210.6574294803,
      sma: 5198.16,
      lbb: 5169.0061759436,
      ubb: 5219.9598240564,
      mbb: 5194.483
    },
    {
      timestamp: "2020-03-15 02:39:00",
      close: 5207.7,
      rsi: 61.1893655048,
      ema: 5210.6981347395,
      sma: 5199.4966666667,
      lbb: 5171.511957125,
      ubb: 5220.649042875,
      mbb: 5196.0805
    },
    {
      timestamp: "2020-03-15 02:40:00",
      close: 5198.11,
      rsi: 52.3955918006,
      ema: 5208.4589323416,
      sma: 5200.222,
      lbb: 5172.8073629369,
      ubb: 5220.7416370631,
      mbb: 5196.7745
    }
  ];

  const [ticker, setTicker] = useState({});
  const [timeInterval, setTimeInterval] = useState("1m");
  const [data, setData] = useState({});
  let request = {
    action: "Update",
    ticker: match.params.ticker,
    minDate: "2020-03-15 02:37:00",
    maxDate: "2020-03-15 02:41:00",
    timeInterval: timeInterval
  };

  useEffect(() => {
    fetchItem();
    conn.onmessage = function(e) {
      setData(JSON.parse(e.data));
      console.log("data here is", data);
    };
    conn.onopen = () => {
      conn.send(JSON.stringify(request));
    };
  }, []);

  useEffect(() => {
    conn.onmessage = function(e) {
      setData(JSON.parse(e.data));
    };
    if (conn.readyState === 1) {
      conn.send(JSON.stringify(request));
    }
  }, [timeInterval]);

  const fetchItem = async () => {
    const fetchCryptoName = await fetch(
      `http://127.0.0.1:8000/api/crypto/${match.params.ticker}`
    );
    const fullTickerName = await fetchCryptoName.json();
    setTicker(fullTickerName);
  };
  const timeMapping = {
    "1m": "1 Minute",
    "1M": "1 Month",
    "1d": "1 Day",
    "1w": "1 Week",
    "5m": "5 Minutes",
    "1h": "1 Hour"
  };
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "4em" }}>
        <h1>
          {ticker.fullName}-({match.params.ticker})
        </h1>
        <h3 style={{ marginTop: "1em" }}>
          Displaying data for Time Interval: {timeMapping[timeInterval]}
        </h3>
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
                    setTimeInterval("1m");
                  }}
                >
                  1 Minute
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setTimeInterval("5m");
                  }}
                >
                  5 Minute
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setTimeInterval("1h");
                  }}
                >
                  1 Hour
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setTimeInterval("1d");
                  }}
                >
                  1 Day
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setTimeInterval("1w");
                  }}
                >
                  1 Week
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setTimeInterval("1M");
                  }}
                >
                  1 Month
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "10px",
            width: "800px",
            height: "800px"
          }}
        >
          {console.log("data down here is", data)}
          {data && (
            <LineChart
              width={600}
              height={300}
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="timestamp" />
              <YAxis dataKey="close" domain={[5170, 5250]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Brush dataKey="name" height={30} stroke="#8884d8" />
              <Line
                type="monotone"
                dataKey="ema"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="close" stroke="#82ca9d" />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
}

export default CryptoLanding;
