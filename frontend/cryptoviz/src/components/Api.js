import { useEffect, useRef } from "react";

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