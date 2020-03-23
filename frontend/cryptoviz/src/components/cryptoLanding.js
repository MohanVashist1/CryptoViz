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
const d = new Date();
function CryptoLanding({ match }) {
  var currDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  var currTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  const [ticker, setTicker] = useState({});
  const [timeInterval, setTimeInterval] = useState("1m");
  const [data, setData] = useState([]);
  const [minDate, setminDate] = useState("2020-03-20 13:00:00");
  const [maxDate, setmaxDate] = useState(currDate + " " + currTime);
  const [minPrice, setminPrice] = useState(1000000);
  const [maxPrice, setmaxPrice] = useState(0);
  let request = {
    action: "Update",
    ticker: match.params.ticker,
    minDate: minDate,
    maxDate: maxDate,
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
    console.log(request);
    // conn.onmessage = function(e) {
    //   setData(JSON.parse(e.data));
    //   console.log("erwerwerwer");
    // };
    // if (conn.readyState === 1) {
    //   conn.send(JSON.stringify(request));
    // }
  }, [timeInterval, minDate, maxDate]);

  const fetchItem = async () => {
    const fetchCryptoName = await fetch(
      `http://localhost:8000/api/crypto/${match.params.ticker}`
    );
    const fullTickerName = await fetchCryptoName.json();
    setTicker(fullTickerName);
  };

  const fetchData = async () => {
    await fetch(`http://localhost:8000/api/crypto/${match.params.ticker}`, {
      method: "post",
      body: JSON.stringify(request)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(res) {
        var currData = JSON.parse(res.data);
        for (var i = 0; i < currData.length; i++) {
          if (parseFloat(currData[i]["close"]) < minPrice) {
            setminPrice(parseFloat(currData[i]["close"]));
          } else if (parseFloat(currData[i]["close"]) > maxPrice) {
            setmaxPrice(parseFloat(currData[i]["close"]));
          }
        }
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
                    setminDate("2020-03-20 13:00:00");
                    setmaxDate(currDate + " " + currTime);
                    setTimeInterval("1m");
                  }}
                >
                  1 Minute
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setminDate("2020-03-20 13:00:00");
                    setmaxDate(currDate + " " + currTime);
                    setTimeInterval("5m");
                  }}
                >
                  5 Minute
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setminDate("2020-03-20 00:00:00");
                    setmaxDate(currDate + " " + currTime);
                    setTimeInterval("1h");
                  }}
                >
                  1 Hour
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setminDate("2020-00-01");
                    setmaxDate("2020-03-01");
                    setTimeInterval("1d");
                  }}
                >
                  1 Day
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setminDate("2020-00-00");
                    setmaxDate("2020-03-01");
                    setTimeInterval("1w");
                  }}
                >
                  1 Week
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setminDate("2019-00-01");
                    setmaxDate("2020-03-01");
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
          {data && (
            <LineChart
              width={1000}
              height={700}
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="timestamp" />
              <YAxis dataKey="close" domain={[minPrice, maxPrice]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Brush dataKey="name" height={30} stroke="#8884d8" />
              <Line
                type="monotone"
                dataKey="ema"
                stroke="#db0202"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="ubb"
                stroke="#0f0f0f"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="lbb"
                stroke="#f06e6e"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="mbb"
                stroke="#41db30"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="close" stroke="#131196" />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
}

export default CryptoLanding;
