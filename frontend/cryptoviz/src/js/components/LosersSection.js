import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { useInterval } from '../api/common';
import { trackPromise } from 'react-promise-tracker';
import { Spinner } from './Spinner';
import { areas } from '../constants/areas';
import { AuthContext } from "./App";
import Cookies from 'js-cookie';

function LosersSection() {

  let mounted = true;
  const { state: authState, dispatch } = useContext(AuthContext);
  const [losersTimeInterval, setLosersTimeInterval] = useState("1");
  const [errorMessage, setErrorMessage] = useState("");
  const [losers, setLosers] = useState([]);

  useEffect(() => {
    mounted = true;
    return () => {
      mounted = false;
    };
  }, []);

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
      if(mounted) {
        setLosers(data.losers);
      }
    } catch(error) {
      console.error("There was an error!", error);
    }
  };

  const updateUser = async (updatedUser) => {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + Cookies.get('user_auth')
      },
      body: JSON.stringify(updatedUser),
      credentials: 'include'
    };
    try {
      let response = await fetch('http://localhost:8000/api/users/me', requestOptions);
      let data = await response.json();
      if (!response.ok) {
        const error = (data && data.detail) ? data.detail : response.status;
        if(mounted) {
          setErrorMessage(error);
        }
        console.error("There was an error!", error);
        return;
      }
      if(mounted) {
        setErrorMessage('');
      }
      dispatch({
        type: "LOGIN",
        payload: {
          user: updatedUser
        }
      });
    } catch(error) {
      if(mounted) {
        setErrorMessage(error);
      }
      console.error("There was an error!", error);
    }
  }

  const deleteFromWatchlist = ele => {
    let eleIndex = authState.user.watchlist.indexOf(ele);
    let tmp = JSON.parse(JSON.stringify(authState.user));
    tmp.watchlist.splice(eleIndex, 1);
    updateUser(tmp);
  }

  const addToWatchlist = ele => {
    let tmp = JSON.parse(JSON.stringify(authState.user));
    tmp.watchlist.push(ele);
    updateUser(tmp);
  }

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
        <td key={count}>{data[i].rank}</td>
      );
      cells.push(
        <td key={count + 1}><Link to={`/crypto/${data[i].symbol}USDT`}>{data[i].symbol}</Link></td>
      );
      cells.push(
        <td key={count + 2}>{data[i].market_cap}</td>
      );
      cells.push(
        <td key={count + 3}>{data[i].price}</td>
      );
      cells.push(
        <td key={count + 4}>{data[i].volume}</td>
      );
      let color = "black";
      if(data[i].percent.substring(0, 1) == "-") {
        color = "red";
      } else if(data[i].percent.substring(0, 1) == "+") {
        color = "green";
      }
      cells.push(
        <td style={{color: color}} key={count + 5}>{data[i].percent}</td>
      );
      count += 6;
      if (Object.keys(authState.user).length > 0) {
        if (authState.user.watchlist.includes(data[i].symbol)) {
          cells.push(
            <td key={count}><i style={{color: "red", cursor:"pointer"}} className="fa fa-times-circle fa-lg" data-toggle="tooltip" data-placement="top" title="" data-original-title="Remove from watchlist" onClick={() => deleteFromWatchlist(data[i].symbol)}></i></td>
          );
        } else {
          cells.push(
            <td key={count}><i style={{color: "green", cursor:"pointer"}} className="fa fa-plus-circle fa-lg" data-toggle="tooltip" data-placement="top" title="" data-original-title="Add to watchlist" onClick={() => addToWatchlist(data[i].symbol)}></i></td>
          );
        }
        count += 1;
      }
      rows.push(
        <tr key={count} className={rowClass}>
          {cells}
        </tr>
      );
      rowClass = rowClass === "table-primary" ? "table-secondary" : "table-primary";
      count += 1;
      cells = [];
    }
    return rows;
  };

  return (
      <div style={{ textAlign: "center"}}>
        {errorMessage && <div style={{margin: "auto", textAlign: "center"}} className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <div className="mr-auto">Error</div>
              <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={() => {setErrorMessage('')}}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="toast-body">
            {errorMessage}
          </div>
        </div>}
        <h1 style={{ marginTop: "2em" }}>Top 10 Losers ({timeMapping[losersTimeInterval]})</h1>
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
                  href="#"
                  className="dropdown-item"
                  onClick={() => {
                    setLosersTimeInterval("1");
                  }}
                >
                  {timeMapping["1"]}
                </a>
                <a
                  href="#"
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
        <div style={{marginTop: "4em"}}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Symbol</th>
                <th scope="col">Market Cap</th>
                <th scope="col">Price</th>
                <th scope="col">Volume</th>
                <th scope="col">%</th>
                {Object.keys(authState.user).length > 0 && <th scope="col">Action</th>}
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
