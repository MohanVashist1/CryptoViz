import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
  LineChart,
  Brush,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Navbar from "./Navbar";
import { fetchTickerFullName, fetchTickerData } from "../api";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import Cookies from "js-cookie";
import { AuthContext } from "./App";
import { updateUser } from "../api";
import { UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE } from "../constants/auth";

const d = new Date();

function pad(n) {
  return n < 10 ? "0" + n : n;
}

function CryptoLanding({ match }) {
  const { state: authState, dispatch } = useContext(AuthContext);
  const history = useHistory();
  var currDate =
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate());
  var currTime =
    pad(d.getUTCHours()) +
    ":" +
    pad(d.getUTCMinutes()) +
    ":" +
    pad(d.getUTCSeconds());
  var dateOneMonthAgo =
    d.getUTCFullYear() + "-" + pad(d.getUTCMonth()) + "-" + pad(d.getUTCDate());
  if (d.getUTCMonth() + 1 === 0) {
    dateOneMonthAgo =
      d.getUTCFullYear() - 1 + "-" + "12" + "-" + pad(d.getUTCDate());
  }
  const [ticker, setTicker] = useState({});
  const [timeInterval, setTimeInterval] = useState("1d");
  const [data, setData] = useState([]);
  const [minDate, setminDate] = useState(dateOneMonthAgo + " " + currTime); //default time
  const [maxDate, setmaxDate] = useState(currDate + " " + currTime);
  const [minPrice, setminPrice] = useState(1000000);
  const [maxPrice, setmaxPrice] = useState(0);
  let request = {
    ticker: match.params.ticker,
    minDate: minDate,
    maxDate: maxDate,
    timeInterval: timeInterval,
  };

  useEffect(() => {
    fetchTickerFullName(match.params.ticker)
      .then((res) => {
        setTicker(res);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    fetchTickerData(match.params.ticker, request).then((res) => {
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
  }, []);

  useEffect(() => {
    fetchTickerData(match.params.ticker, request).then((res) => {
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
  }, [timeInterval, minDate, maxDate]);

  const timeMapping = {
    "1m": "1 Minute",
    "1M": "1 Month",
    "1d": "1 Day",
    "1w": "1 Week",
    "5m": "5 Minutes",
    "1h": "1 Hour",
  };
  const renderRedirect = () => {
    history.push(`/crypto/advanced/${match.params.ticker}`);
  };

  const update = (updatedUser) => {
    updateUser(updatedUser)
      .then(() => {
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: {
            user: updatedUser,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_USER_FAILURE,
          payload: {
            error: error,
          },
        });
        console.error("There was an error!", error);
      });
  };

  const deleteFromWatchlist = (ele) => {
    let eleIndex = authState.user.watchlist.indexOf(ele);
    let tmp = JSON.parse(JSON.stringify(authState.user));
    tmp.watchlist.splice(eleIndex, 1);
    update(tmp);
  };

  const addToWatchlist = (ele) => {
    let tmp = JSON.parse(JSON.stringify(authState.user));
    tmp.watchlist.push(ele);
    update(tmp);
  };

  const displayWatchList = () => {
    if (authState.isAuthenticated) {
      if (
        authState.user.watchlist.includes(
          match.params.ticker.replace("USDT", "")
        )
      ) {
        return (
          <div>
            <OverlayTrigger
              //removed key
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">Remove from watchlist</Tooltip>
              }
            >
              <i
                style={{ color: "red", cursor: "pointer" }}
                className="fa fa-times-circle fa-lg"
                onClick={() =>
                  deleteFromWatchlist(match.params.ticker.replace("USDT", ""))
                }
              ></i>
            </OverlayTrigger>
          </div>
        );
      } else {
        return (
          <div>
            <OverlayTrigger
              // removed key
              placement="top"
              overlay={<Tooltip id="tooltip-top">Add to watchlist</Tooltip>}
            >
              <i
                style={{ color: "green", cursor: "pointer" }}
                className="fa fa-plus-circle fa-lg"
                onClick={() =>
                  addToWatchlist(match.params.ticker.replace("USDT", ""))
                }
              ></i>
            </OverlayTrigger>
          </div>
        );
      }
    }
  };

  return (
    <div>
      {(Cookies.get("user_auth") && authState.isAuthenticated) ||
      (!Cookies.get("user_auth") && !authState.isAuthenticated) ? (
        <div>
          <Navbar />
          {displayWatchList()}
          <div style={{ textAlign: "center", marginTop: "4em" }}>
            <h1>
              {ticker.fullName}-({match.params.ticker})
            </h1>

            <h3 style={{ marginTop: "1em" }}>
              Displaying data for Time Interval: {timeMapping[timeInterval]}
            </h3>
            <div style={{ marginTop: "2em" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={renderRedirect}
              >
                Advanced Charts
              </button>
            </div>
            <div style={{ marginTop: "1em", float: "none" }}>
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
                  <div
                    className="dropdown-menu"
                    aria-labelledby="btnGroupDrop1"
                  >
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        var timeOneHourAgo =
                          currDate +
                          " " +
                          pad(d.getUTCHours() - 1) +
                          ":" +
                          pad(d.getUTCMinutes()) +
                          ":" +
                          pad(d.getUTCSeconds());
                        if (d.getUTCHours() === 0) {
                          timeOneHourAgo =
                            pad(d.getUTCFullYear()) +
                            "-" +
                            pad(d.getUTCMonth() + 1) +
                            "-" +
                            pad(d.getUTCDate() - 1) +
                            " " +
                            "23" +
                            ":" +
                            pad(d.getUTCMinutes()) +
                            ":" +
                            pad(d.getUTCSeconds());
                        }
                        setminDate(timeOneHourAgo);
                        setmaxDate(currDate + " " + currTime);
                        setTimeInterval("1m");
                      }}
                    >
                      1 Minute
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        var timeOneHourAgo =
                          currDate +
                          " " +
                          pad(d.getUTCHours() - 1) +
                          ":" +
                          pad(d.getUTCMinutes()) +
                          ":" +
                          pad(d.getUTCSeconds());
                        if (d.getUTCHours() === 0) {
                          timeOneHourAgo =
                            d.getUTCFullYear() +
                            "-" +
                            pad(d.getUTCMonth() + 1) +
                            "-" +
                            pad(d.getUTCDate() - 1) +
                            " " +
                            "23" +
                            ":" +
                            pad(d.getUTCMinutes()) +
                            ":" +
                            pad(d.getUTCSeconds());
                        }
                        setminDate(timeOneHourAgo);
                        setmaxDate(currDate + " " + currTime);
                        setTimeInterval("5m");
                      }}
                    >
                      5 Minute
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        var dateOneDayAgo =
                          pad(d.getUTCFullYear()) +
                          "-" +
                          pad(d.getUTCMonth() + 1) +
                          "-" +
                          pad(d.getUTCDate() - 1);
                        if (d.getUTCDate() === 0) {
                          dateOneDayAgo =
                            d.getUTCFullYear() +
                            "-" +
                            pad(d.getUTCMonth() + 1) +
                            "-" +
                            "23";
                        }
                        setminDate(dateOneDayAgo + " " + currTime);
                        setmaxDate(currDate + " " + currTime);
                        setTimeInterval("1h");
                      }}
                    >
                      1 Hour
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setminDate(dateOneMonthAgo + " " + currTime);
                        setmaxDate(currDate + " " + currTime);
                        setTimeInterval("1d");
                      }}
                    >
                      1 Day
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setminDate("2020-00-00");
                        setmaxDate(currDate + " " + currTime);
                        setTimeInterval("1w");
                      }}
                    >
                      1 Week
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        setminDate("2019-00-01");
                        setmaxDate(currDate + " " + currTime);
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
                margin: "auto",
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
                  <Line type="monotone" dataKey="close" stroke="#131196" />
                </LineChart>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20em" }}>
          <Loader type="ThreeDots" color="#2BAD60" />
        </div>
      )}
    </div>
  );
}

export default CryptoLanding;
