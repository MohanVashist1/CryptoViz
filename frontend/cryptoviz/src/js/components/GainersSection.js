import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { useInterval } from '../api/common';
import { trackPromise } from 'react-promise-tracker';
import { Spinner } from './Spinner';
import { GAINERS_AREA } from '../constants/areas';
import { UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE, ERROR_CLOSE } from '../constants/auth';
import { AuthContext } from "./App";
import Cookies from 'js-cookie';

function GainersSection() {

  let mounted = true;
  const { state: authState, dispatch } = useContext(AuthContext);
  const [gainersTimeInterval, setGainersTimeInterval] = useState("1");
  const [gainers, setGainers] = useState([]);

  useEffect(() => {
    mounted = true;
    return () => {
      mounted = false;
    };
  }, []);

  useInterval(() => {
    getGainers();
  }, 30000);

  useEffect(() => {
    if(mounted) {
      setGainers([]);
    }
    trackPromise(getGainers(), GAINERS_AREA);
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
      if (mounted) {
        setGainers(data.gainers);
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
        // if (mounted) {
          dispatch({
            type: UPDATE_USER_FAILURE,
            payload: {
              error: error
            }
          });
        // }
        console.error("There was an error!", error);
        return;
      }
      // if (mounted) {
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: {
            user: updatedUser
          }
        });
      // }
    } catch(error) {
      // if (mounted) {
        dispatch({
          type: UPDATE_USER_FAILURE,
          payload: {
            error: error
          }
        });
      // }
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
      cells.push(
        <td style={{color: "green"}} key={count + 5}>{data[i].percent}</td>
      );
      count += 6;
      if (authState.isAuthenticated) {
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

  const handleCloseError = () => {
    dispatch({
      type: ERROR_CLOSE
    });
  }

  const handleIntervalSwitch = time => {
    if(mounted) {
      setGainersTimeInterval(time);
    }
  }

  return (
      <div style={{ textAlign: "center"}}>
        {authState.error && <div style={{margin: "auto", textAlign: "center"}} className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <div className="mr-auto">Error</div>
              <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={handleCloseError}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="toast-body">
            {authState.error}
          </div>
        </div>}
        <h1 style={{ marginTop: "2em" }}>Top Gainers [{timeMapping[gainersTimeInterval]}]</h1>
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
                  href="#"
                  className="dropdown-item"
                  onClick={() => handleIntervalSwitch("1")}
                >
                  {timeMapping["1"]}
                </a>
                <a
                  href="#"
                  className="dropdown-item"
                  onClick={() => handleIntervalSwitch("24")}
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
                <th scope="col"><h5>Rank</h5></th>
                <th scope="col"><h5>Symbol</h5></th>
                <th scope="col"><h5>Market Cap</h5></th>
                <th scope="col"><h5>Price</h5></th>
                <th scope="col"><h5>Volume</h5></th>
                <th scope="col"><h5>%</h5></th>
                {authState.isAuthenticated && <th scope="col"><h5>Action</h5></th>}
              </tr>
            </thead>
            <tbody>{createTable(gainers)}</tbody>
          </table>
          <Spinner area={GAINERS_AREA}/>
        </div>
      </div>
  );
}

export default GainersSection;
