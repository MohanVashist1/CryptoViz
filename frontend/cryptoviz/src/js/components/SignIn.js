import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link } from 'react-router-dom';
import { useInterval } from '../common';
import { LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants/auth';
import Navbar from "./Navbar";
import { login } from '../api';
import { AuthContext } from "./App";
import Loader from "react-loader-spinner";
import Cookie from 'js-cookie';

function SignIn() {

    const { state: authState, dispatch } = useContext(AuthContext);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        checkSignedIn();
    }, []);

    useInterval(() => {
        checkSignedIn();
    }, 500);

    const checkSignedIn = () => {
        if(Cookie.get('isLoggedIn') && Cookie.get('isLoggedIn').toLowerCase() === 'true') {
            history.push('/');
        }
    };

    const signIn = e => {
        e.preventDefault();
        login(email, password).then(() => {
            dispatch({
                type: LOGIN_SUCCESS
            });
            history.push('/');
        }).catch(error => {
            dispatch({
                type: LOGIN_FAILURE,
                payload: {
                  error: error
                }
            });
            console.error("There was an error!", error);
        });
    };

    return (
        <div>
            {((!Cookie.get('isLoggedIn') || Cookie.get('isLoggedIn').toLowerCase() === 'false') && !authState.isAuthenticated) ?
            <div>
                <Navbar />
                <form style={{ width: "45%", margin: "auto", marginTop: "15vh" }} onSubmit={signIn}>
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
            </div> :
            <div style={{ textAlign: "center", marginTop: "20em" }}>
                <Loader type="ThreeDots" color="#2BAD60" />
            </div>}
        </div>
    )
}

export default SignIn
