import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home({ match }) {
  const [losersTimeInterval, setLosersTimeInterval] = useState("1");
  const [gainersTimeInterval, setGainersTimeInterval] = useState("1");
  const [losers, setLosers] = useState({});
  const [gainers, setGainers] = useState({});

  useEffect(() => {
    fetchGainers();
    fetchLosers();
  }, []);

  useEffect(() => {
    fetchGainers();
  }, [gainersTimeInterval]);

  useEffect(() => {
    fetchLosers();
  }, [losersTimeInterval]);

  const fetchLosers = async () => {
    const func = await fetch(
      `http://127.0.0.1:8000/api/losers/?time=${losersTimeInterval}`
    );
    console.log('here')
    const losers = await func.json();
    console.log(losers)
    setLosers(losers.losers);
  };

  const fetchGainers = async () => {
    const func = await fetch(
      `http://127.0.0.1:8000/api/gainers/?time=${gainersTimeInterval}`
    );
    console.log('here')
    const gainers = await func.json();
    console.log(gainers)
    setGainers(gainers.gainers);
  };

  const timeMapping = {
    "1": "1 Hour",
    "24": "1 Day",
  };

  const createTable = (data) => {
    let table = [];
    let rowClass = "table-primary";
    // Outer loop to create parent
    for (let i = 0; i < data.length; i++) {
      let children = [];
      //Inner loop to create children
      children.push(<th scope="row">Active</th>);
      children.push(<td>{data[i].rank}</td>);
      children.push(<td>{data[i].symbol}</td>);
      children.push(<td>{data[i].market_cap}</td>);
      children.push(<td>{data[i].price}</td>);
      children.push(<td>{data[i].volume}</td>);
      //Create the parent and add the children
      table.push(<tr className={rowClass}>{children}</tr>);
      rowClass = (rowClass == "table-primary") ? "table-secondary" : "table-primary";
    }
    return table;
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "4em" }}>
        <h1>
          Top 10 Gainers ({timeMapping[gainersTimeInterval]})
        </h1>
        <div style={{ marginTop: "2em" }}>
          <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
            <button type="button" className="btn btn-primary">
              Select Time Interval
            </button>
            <div className="btn-group" role="group">
              <button id="btnGroupDrop1" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <a className="dropdown-item" onClick={() => {setGainersTimeInterval("1");}}>
                  {timeMapping["1"]}
                </a>
                <a className="dropdown-item" onClick={() => {setGainersTimeInterval("24");}}>
                  {timeMapping["24"]}
                </a>
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
            <tbody>
              {createTable(gainers)}
            </tbody>
          </table> 
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "4em" }}>
        <h1>
          Top 10 Losers ({timeMapping[losersTimeInterval]})
        </h1>
        <div style={{ marginTop: "2em" }}>
          <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
            <button type="button" className="btn btn-primary">
              Select Time Interval
            </button>
            <div className="btn-group" role="group">
              <button id="btnGroupDrop1" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <a className="dropdown-item" onClick={() => {setLosersTimeInterval("1");}}>
                  {timeMapping["1"]}
                </a>
                <a className="dropdown-item" onClick={() => {setLosersTimeInterval("24");}}>
                  {timeMapping["24"]}
                </a>
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
            <tbody>
              {createTable(losers)}
            </tbody>
          </table> 
        </div>
      </div>
    </div>
  );
}

export default Home;
