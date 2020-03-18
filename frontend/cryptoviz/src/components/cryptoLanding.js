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

// var conn = new WebSocket(`ws://localhost:8000/api/crypto/`);

function CryptoLanding({ match }) {
  const [ticker, setTicker] = useState({});
  const [timeInterval, setTimeInterval] = useState("1m");
  const [data, setData] = useState([]);
  let request = {
    action: "Update",
    ticker: match.params.ticker,
    minDate: "2020-03-15 02:37:00",
    maxDate: "2020-03-15 02:41:00",
    timeInterval: timeInterval
  };

  useEffect(() => {
    fetchItem();
    fetchData();
    // conn.onmessage = function(e) {
    //   console.log(typeof e.data);
    //   setData(JSON.parse(e.data));
    //   console.log("erwerwerwer");
    // };
    // conn.onopen = () => {
    //   conn.send(JSON.stringify(request));
    // };
  }, []);

  useEffect(() => {
    fetchData();
    // conn.onmessage = function(e) {
    //   setData(JSON.parse(e.data));
    //   console.log("erwerwerwer");
    // };
    // if (conn.readyState === 1) {
    //   conn.send(JSON.stringify(request));
    // }
  }, [timeInterval]);

  const fetchItem = async () => {
    const fetchCryptoName = await fetch(
      `http://127.0.0.1:8000/api/crypto/${match.params.ticker}`
    );
    const fullTickerName = await fetchCryptoName.json();
    setTicker(fullTickerName);
  };

  const fetchData = async () => {
    await fetch(`http://127.0.0.1:8000/api/crypto/${match.params.ticker}`, {
      method: "post",
      body: JSON.stringify(request)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(res) {
        console.log("res is", JSON.parse(res.data));
        setData(JSON.parse(res.data));
      });
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
            marginTop: "2em",
            width: "1000px",
            height: "1000px",
            margin: "auto"
          }}
        >
          {console.log("data down here is", data)}
          {data && (
            <LineChart
              width={1000}
              height={700}
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
              <Line
                type="monotone"
                dataKey="ubb"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="lbb"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="mbb"
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
