import React, { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

/********************************************************************************************
 *    Title: Making setInterval Declarative with React Hooks
 *    Author: Abramov, Dan
 *    Date: February 4, 2019
 *    Availability: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 ********************************************************************************************/
export const useInterval = (callback, delay) => {
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
};

export const createTable = data => {
  let rows = [];
  let rowClass = "table-primary";
  let cells = [];
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    cells.push(
      <td key={count}>{data[i].rank}</td>
    );
    cells.push(
      <td key={count + 1}>{data[i].symbol}</td>
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