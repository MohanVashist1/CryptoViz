import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useInterval } from './Api';
import Cookies from 'js-cookie';
import LosersSection from './LosersSection';
import GainersSection from './GainersSection';

function Home() {
  const history = useHistory();
  const [currUser, setCurrUser] = useState("");

  useEffect(() => {
    getCurrUser();
  }, []);

  useInterval(() => {
    getCurrUser();
  }, 1000);

  const getCurrUser = async () => {
    if (Cookies.get('user_auth')) {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('user_auth')
        },
        body: null
      };
      try {
        let response = await fetch('http://localhost:8000/api/users/me', requestOptions);
        let data = await response.json();
        if (!response.ok) {
          const error = (data && data.detail) ? data.detail : response.status;
          setCurrUser("");
          console.error("There was an error!", error);
          return;
        }
        setCurrUser(data.first_name);
      } catch(error) {
        setCurrUser("");
        console.error("There was an error!", error);
      }
    } else {
      setCurrUser("");
    }
  };

  const logout = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + Cookies.get('user_auth')
      },
      body: null,
      credentials: 'include'
    };
    try {
      let response = await fetch('http://localhost:8000/api/users/logout/cookie', requestOptions);
      let data = await response.json();
      if (!response.ok) {
        const error = (data && data.detail) ? data.detail : response.status;
        console.error("There was an error!", error);
        return;
      }
      setCurrUser('');
    } catch(error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div>
      {!currUser ?
      <div style={{ marginTop: "4em", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        <button type="button" className="btn btn-outline-primary" onClick = {() => {history.push('/signin');}}>Sign In</button>
        <button type="button" className="btn btn-outline-primary" onClick = {() => {history.push('/signup');}}>Sign Up</button>
      </div> :
      <div style={{ marginTop: "4em", display: "flex", alignItems: "center", justifyContent: "flex-end", marginRight: "2em" }}>
          <div style={{textAlign:"center"}}>
            <h6>Hi, {currUser}!</h6>
            <button type="button" className="btn btn-outline-primary" onClick = {logout}>Logout</button>
          </div>
      </div>}
      <GainersSection />
      <LosersSection />
    </div>
  );
}

export default Home;
