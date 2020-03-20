import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [losersTimeInterval, setLosersTimeInterval] = useState("1");
  const [gainersTimeInterval, setGainersTimeInterval] = useState("1");
  const [losers, setLosers] = useState({});
  const [gainers, setGainers] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  useInterval(() => {
    fetchGainers();
    fetchLosers();
  }, 30000);

  useEffect(() => {
    fetchGainers();
  }, [gainersTimeInterval]);

  useEffect(() => {
    fetchLosers();
  }, [losersTimeInterval]);

  const fetchLosers = async () => {
    fetch(
      `http://127.0.0.1:8000/api/losers/?time=${losersTimeInterval}`
    ).then(async response => {
      const data = await response.json();
      if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
      }
      setLosers(data.losers);
    })
    .catch(error => {
      setErrorMessage(error);
      console.error('There was an error!', error);
    });
  };

  const fetchGainers = async () => {
    fetch(
      `http://127.0.0.1:8000/api/gainers/?time=${gainersTimeInterval}`
    ).then(async response => {
      const data = await response.json();
      if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
      }
      setGainers(data.gainers);
    })
    .catch(error => {
      setErrorMessage(error);
      console.error('There was an error!', error);
    });
  };

  const timeMapping = {
    "1": "1 Hour",
    "24": "1 Day",
  };

  const createTable = data => {
    let rows = [];
    let rowClass = "table-primary";
    let cells = [];
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      cells.push(<td key={count}><Link to={`/crypto/${data[i].symbol}USDT/`}>{data[i].rank}</Link></td>);
      cells.push(<td key={count + 1}><Link to={`/crypto/${data[i].symbol}USDT/`}>{data[i].symbol}</Link></td>);
      cells.push(<td key={count + 2}><Link to={`/crypto/${data[i].symbol}USDT/`}>${data[i].market_cap}</Link></td>);
      cells.push(<td key={count + 3}><Link to={`/crypto/${data[i].symbol}USDT/`}>${data[i].price}</Link></td>);
      cells.push(<td key={count + 4}><Link to={`/crypto/${data[i].symbol}USDT/`}>${data[i].volume}</Link></td>);
      rows.push(<tr key={count + 5} className={rowClass}>{cells}</tr>);
      rowClass = (rowClass === "table-primary") ? "table-secondary" : "table-primary";
      count += 6
      cells = [];
    }
    return rows;
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "4em" }}>
        <h1>Top 10 Gainers ({timeMapping[gainersTimeInterval]})</h1>
        <div style={{ marginTop: "2em" }}>
          <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
            <button type="button" className="btn btn-primary">Select Time Interval</button>
            <div className="btn-group" role="group">
              <button id="btnGroupDrop1" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <a className="dropdown-item" onClick={() => {setGainersTimeInterval("1");}}>{timeMapping["1"]}</a>
                <a className="dropdown-item" onClick={() => {setGainersTimeInterval("24");}}>{timeMapping["24"]}</a>
              </div>
            </div>
          </div>
        </div>
        <div style={{margin: "auto", padding: "30px", width: "80%"}}>
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
        </div>
      </div>
      <div style={{ textAlign: "center"}}>
        <h1>Top 10 Losers ({timeMapping[losersTimeInterval]})</h1>
        <div style={{ marginTop: "2em" }}>
          <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
            <button type="button" className="btn btn-primary">Select Time Interval</button>
            <div className="btn-group" role="group">
              <button id="btnGroupDrop1" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <a className="dropdown-item" onClick={() => {setLosersTimeInterval("1");}}>{timeMapping["1"]}</a>
                <a className="dropdown-item" onClick={() => {setLosersTimeInterval("24");}}>{timeMapping["24"]}</a>
              </div>
            </div>
          </div>
        </div>
        <div style={{margin: "auto", padding: "30px", width: "80%"}}>
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
        </div>
      </div>
    </div>
  );
}

/********************************************************************************************
*    Title: Making setInterval Declarative with React Hooks
*    Author: Abramov, Dan
*    Date: February 4, 2019
*    Availability: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
********************************************************************************************/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default Home;
