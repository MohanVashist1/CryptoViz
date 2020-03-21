import React, { useState } from 'react'

function Login() {

    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = () => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email) ) {
            setErrorMessage("INVALID_EMAIL");
        }
        else {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'email': email, 'password': password, 'watchlist': []})
            };
            fetchCommon('http://127.0.0.1:8000/api/users/register', requestOptions);
        }
    };

    const login = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "username=" + email + "&password=" + password
        };
        fetchCommon('http://127.0.0.1:8000/api/users/login/cookie', requestOptions);
    };

    const fetchCommon = (url, requestOptions) => {
        fetch(url, requestOptions)
          .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.detail) ? (data && data.detail) : response.status;
                return Promise.reject(error);
            }
            setErrorMessage('');
          })
          .catch(error => {
            setErrorMessage(error);
            console.error("There was an error!", error);
        });
    }

    return (
        <div>
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
            <form style={{ width: "45%", margin: "auto", marginTop: "15vh", textAlign: "center" }}>
                <fieldset>
                    <legend><h2>Login / Sign Up</h2></legend>
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
        </div>
    )
}

export default Login
