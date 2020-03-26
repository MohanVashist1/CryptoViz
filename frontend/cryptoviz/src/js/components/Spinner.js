/*****************************************************************************************************************************************************
 *    Title: react-promise-tracker
 *    Author: Lemoncode
 *    Date: March 26, 2019
 *    Availability: https://github.com/Lemoncode/react-promise-tracker/blob/master/examples/01-example-areas/src/common/components/spinner/spinner.js
 *****************************************************************************************************************************************************/

import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";

export const Spinner = props => {
  const { promiseInProgress } = usePromiseTracker({area: props.area, delay: 0});

  return (
    promiseInProgress && (
        <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
        <Loader type="ThreeDots" color="#2BAD60" />
      </div>
    )
  );
};
