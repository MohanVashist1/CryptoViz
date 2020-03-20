import React, { useState } from 'react'

function Login() {

    const [errorMessage, setErrorMessage] = useState({});
    const [email, setEmail] = useState({});
    const [password, setPassword] = useState({});

    const signUp = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'email': email, 'password': password, 'watchlist': []})
        };
        fetchCommon('http://127.0.0.1:8000/api/users/register/', requestOptions);
    };

    const login = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: "email="+email+"&password="+password
        };
        fetchCommon('http://127.0.0.1:8000/api/users/login/cookie/', requestOptions);
    };

    const fetchCommon = (url, requestOptions) => {
        fetch(url, requestOptions)
          .then(async response => {
            console.log(requestOptions);
            const data = await response.json();
            if (!response.ok) {
              const error = (data && data.message) || response.status;
              return Promise.reject(error);
            }
            console.log("done!")
            // setLosers(data.losers);
          })
          .catch(error => {
            setErrorMessage(error);
            console.log(error);
            console.error("There was an error!", error);
        });
    }

    return (
        <form style={{ width: "50%", margin: "auto", marginTop: "20vh" }}>
            <fieldset>
                <legend style={{ textAlign: "center" }}><h2>Login / Sign Up</h2></legend>
                <div className="form-group">
                    <label htmlFor="InputEmail">Email address</label>
                    <input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email" onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="InputPassword">Password</label>
                    <input type="password" className="form-control" id="InputPassword" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around"}}>
                    <button type="button" className="btn btn-primary" onClick={login}>Log In</button>
                    <button type="button" className="btn btn-primary" onClick={signUp}>Sign Up</button>
                </div>
            </fieldset>
        </form>
    )
}

export default Login
