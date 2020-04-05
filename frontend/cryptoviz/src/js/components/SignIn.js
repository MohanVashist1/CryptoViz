import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link } from 'react-router-dom';
import { useInterval } from '../api/common';
import { AuthContext } from "./App";

function SignIn() {

    const { state: authState } = useContext(AuthContext);
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        checkSignedIn();
    }, []);

    useInterval(() => {
        checkSignedIn();
    }, 1000);

    const checkSignedIn = () => {
        if(Object.keys(authState.user).length > 0) {
            history.push('/');
        }
    };

    const signIn = async () => {
        let requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "username=" + email + "&password=" + password,
            credentials: 'include'
        };
        try {
            let response = await fetch('http://localhost:8000/api/users/login/cookie', requestOptions);
            let data = await response.json();
            if (!response.ok) {
                const error = (data && data.detail) ? data.detail : response.status;
                setErrorMessage(error);
                console.error("There was an error!", error);
                return;
            }
            setErrorMessage('');
            history.push('/');
        } catch(error) {
            setErrorMessage(error);
            console.error("There was an error!", error);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        signIn();
    }

    return (
        <div>
            {Object.keys(authState.user).length == 0 &&
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
                <form style={{ width: "45%", margin: "auto", marginTop: "15vh" }} onSubmit={handleSubmit}>
                    <fieldset>
                        <legend style={{textAlign: "center"}}><h2>Sign In</h2></legend>
                        <div className="form-group">
                            <label htmlFor="InputEmail">Email address</label>
                            <input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email" onChange={e => setEmail(e.target.value)} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="InputPassword">Password</label>
                            <input type="password" className="form-control" id="InputPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                        </div>
                        <div className="form-group">
                            <label>Don't have an account? <Link to="/signup">Sign Up</Link></label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around"}}>
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </div>
                    </fieldset>
                </form>
            </div>}
        </div>
    )
}

export default SignIn
