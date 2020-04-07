import "bootswatch/dist/lux/bootstrap.min.css";
import OverlayTrigger  from 'react-bootstrap/OverlayTrigger';
import Tooltip  from 'react-bootstrap/Tooltip';
import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { useInterval } from '../common/common';
import { trackPromise } from 'react-promise-tracker';
import { Spinner } from './Spinner';
import { GAINERS_AREA, LOSERS_AREA } from '../constants/areas';
import { updateUser, fetchLosers, fetchGainers } from '../api/api';
import { UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE } from '../constants/auth';
import { AuthContext } from "./App";

function Table({ isGainer }) {

  let mounted = true;
  const { state: authState, dispatch } = useContext(AuthContext);
  const [timeInterval, setTimeInterval] = useState("1");
  const [list, setList] = useState([]);

  useEffect(() => {
    mounted = true;
    return () => {
      mounted = false;
    };
  }, []);

  useInterval(() => {
    getList();
  }, 30000);
  
  useEffect(() => {
    if(mounted) {
      setList([]);
    }
    if(isGainer) {
        trackPromise(getList(), GAINERS_AREA);
    } else {
        trackPromise(getList(), LOSERS_AREA);
    }
  }, [timeInterval]);

  const getList = async () => {
    if(isGainer) {
        await fetchGainers(timeInterval).then(res => {
            if(mounted) {
              setList(res);
            }
        }).catch(error => {
            console.error("There was an error!", error);
        });

    } else {
        await fetchLosers(timeInterval).then(res => {
            if(mounted) {
              setList(res);
            }
        }).catch(error => {
            console.error("There was an error!", error);
        });
    }
  }

  const update = updatedUser => {
    updateUser(updatedUser).then(() => {
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: {
          user: updatedUser
        }
      });
    }).catch(error => {
      dispatch({
        type: UPDATE_USER_FAILURE,
        payload: {
          error: error
        }
      });
      console.error("There was an error!", error);
    });
  }

  const deleteFromWatchlist = ele => {
    let eleIndex = authState.user.watchlist.indexOf(ele);
    let tmp = JSON.parse(JSON.stringify(authState.user));
    tmp.watchlist.splice(eleIndex, 1);
    update(tmp);
  }

  const addToWatchlist = ele => {
    let tmp = JSON.parse(JSON.stringify(authState.user));
    tmp.watchlist.push(ele);
    update(tmp);
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
      if(isGainer) {
        cells.push(
            <td style={{color: "green"}} key={count + 5}>{data[i].percent}</td>
        );
      } else {
        cells.push(
            <td style={{color: "red"}} key={count + 5}>{data[i].percent}</td>
        );
      }
      count += 6;
      if (authState.isAuthenticated) {
        if (authState.user.watchlist.includes(data[i].symbol)) {
          cells.push(
            <td key={count}>
                <OverlayTrigger
                    key={`top${count}`}
                    placement="top"
                    overlay={
                        <Tooltip id='tooltip-top'>
                            Remove from watchlist
                        </Tooltip>
                    }
                >
                    <i style={{color: "red", cursor:"pointer"}} className="fa fa-times-circle fa-lg" onClick={() => deleteFromWatchlist(data[i].symbol)}></i>
                </OverlayTrigger>
            </td>
          );
        } else {
          cells.push(
            <td key={count}>
                <OverlayTrigger
                    key={`top${count}`}
                    placement="top"
                    overlay={
                        <Tooltip id='tooltip-top'>
                            Add to watchlist
                        </Tooltip>
                    }
                >
                    <i style={{color: "green", cursor:"pointer"}} className="fa fa-plus-circle fa-lg" onClick={() => addToWatchlist(data[i].symbol)}></i>
                </OverlayTrigger>
            </td>
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

  const handleIntervalSwitch = time => {
    if(mounted) {
      setTimeInterval(time);
    }
  }

  return (
      <div style={{ textAlign: "center"}}>
        {isGainer ? 
        <h1 style={{ marginTop: "2em" }}>Top Gainers [{timeMapping[timeInterval]}]</h1> :
        <h1 style={{ marginTop: "2em" }}>Top Losers [{timeMapping[timeInterval]}]</h1>}
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
            <tbody>{createTable(list)}</tbody>
          </table>
          {isGainer ? 
          <Spinner area={GAINERS_AREA}/> :
          <Spinner area={LOSERS_AREA}/>}
        </div>
      </div>
  );
}

export default Table;
