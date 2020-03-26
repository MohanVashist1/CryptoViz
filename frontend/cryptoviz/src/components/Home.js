import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useHistory, Link } from 'react-router-dom';
import { useInterval } from './Api';
import Cookies from 'js-cookie';
// import { trackPromise } from 'react-promise-tracker';
// import { usePromiseTracker } from "react-promise-tracker";
// import Loader from 'react-loader-spinner';

// const LoadingIndicator = props => {
//   const { promiseInProgress } = usePromiseTracker();
//   return (
//       promiseInProgress &&
//       <div
//       style={{
//         width: "100%",
//         height: "100",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center"
//       }}>
//       <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
//     </div>
//   );
// }

function Home() {
  const history = useHistory();
  const [losersTimeInterval, setLosersTimeInterval] = useState("1");
  const [gainersTimeInterval, setGainersTimeInterval] = useState("1");
  const [currUser, setCurrUser] = useState("");
  const [losers, setLosers] = useState([]);
  const [gainers, setGainers] = useState([]);

  useEffect(() => {
    getCurrUser();
  }, []);

  useInterval(() => {
    getGainers();
    getLosers();
  }, 30000);

  useInterval(() => {
    getCurrUser();
  }, 2000);

  useEffect(() => {
    getGainers();
  }, [gainersTimeInterval]);

  useEffect(() => {
    getLosers();
  }, [losersTimeInterval]);

  const getLosers = () => {
    // trackPromise(
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
      });
    // );
  };

  const getGainers = () => {
    // trackPromise(
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
      });
    // );
  };

  const getCurrUser = () => {
    if (Cookies.get('user_auth')) {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('user_auth')
        },
        body: null
      };
      fetch('http://localhost:8000/api/users/me', requestOptions)
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            const error = (data && data.detail) ? data.detail : response.status;
            return Promise.reject(error);
          }
          setCurrUser(data.first_name);
        })
        .catch(error => {
          setCurrUser("");
          console.error("There was an error!", error);
        });
    } else {
      setCurrUser("");
    }
  };

  const logout = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + Cookies.get('user_auth')
      },
      body: null,
      credentials: 'include'
    };
    fetch('http://localhost:8000/api/users/logout/cookie', requestOptions)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.detail) ? data.detail : response.status;
          return Promise.reject(error);
        }
        setCurrUser("");
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
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
    <div>
      <div style={{ textAlign: "center", marginTop: "4em" }}>
        <div style={{ display: "flex", margin: "0", alignItems: "center", justifyContent: "space-around" }}>
          {!currUser &&
            <button type="button" class="btn btn-outline-primary" onClick = {() => {history.push('/signin');}}>Sign In</button>}
          {currUser &&
            <div style={{visibility: "hidden"}}>
              <h6>Hi, {currUser}!</h6>
              <button type="button" class="btn btn-outline-primary">Logout</button>
            </div>}
          <h1>Top 10 Gainers ({timeMapping[gainersTimeInterval]})</h1>
          {!currUser &&
            <button type="button" class="btn btn-outline-primary" onClick = {() => {history.push('/signup');}}>Sign Up</button>}
          {currUser &&
            <div>
              <h6>Hi, {currUser}!</h6>
              <button type="button" class="btn btn-outline-primary" onClick = {logout}>Logout</button>
            </div>}
        </div>
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
                    // if (gainersTimeInterval == "24") setGainers([]);
                    setGainersTimeInterval("1");
                  }}
                >
                  {timeMapping["1"]}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    // if (gainersTimeInterval == "1") setGainers([]);
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
          {/* <LoadingIndicator /> */}
        </div>
      </div>
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
                    // if (losersTimeInterval == "24") setLosers([]);
                    setLosersTimeInterval("1");
                  }}
                >
                  {timeMapping["1"]}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    // if (losersTimeInterval == "1") setLosers([]);
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
          {/* <LoadingIndicator /> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
