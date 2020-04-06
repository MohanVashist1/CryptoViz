import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link } from 'react-router-dom';
import { useInterval } from '../api/common';
import { REGISTER_SUCCESS, REGISTER_FAILURE, ERROR_CLOSE } from '../constants/auth';
import Navbar from "./Navbar";
import { AuthContext } from "./App";
import Cookies from 'js-cookie';
import Loader from "react-loader-spinner";

function SignUp() {

    const { state: authState, dispatch } = useContext(AuthContext);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        checkSignedIn();
    }, []);

    useInterval(() => {
        checkSignedIn();
    }, 500);

    const checkSignedIn = () => {
        if(Cookies.get('user_auth')) {
            history.push('/');
        }
    };

    const signUp = async () => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email) ) {
            dispatch({
                type: REGISTER_FAILURE,
                payload: {
                  error: "INVALID_EMAIL"
                }
            });
        } else {
            let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'email': email, 'password': password, 'first_name': firstName, 'last_name': lastName})
            };
            try {
                let response = await fetch('http://localhost:8000/api/users/register', requestOptions);
                let data = await response.json();
                if (!response.ok) {
                    const error = (data && data.detail) ? data.detail : response.status;
                    dispatch({
                        type: REGISTER_FAILURE,
                        payload: {
                          error: error
                        }
                    });
                    console.error("There was an error!", error);
                    return;
                }
                requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: "username=" + email + "&password=" + password,
                    credentials: 'include'
                };
                response = await fetch('http://localhost:8000/api/users/login/cookie', requestOptions);
                data = await response.json();
                if (!response.ok) {
                    const error = (data && data.detail) ? data.detail : response.status;
                    dispatch({
                        type: REGISTER_FAILURE,
                        payload: {
                          error: error
                        }
                    });
                    console.error("There was an error!", error);
                    return;
                }
                dispatch({
                    type: REGISTER_SUCCESS
                });
                history.push('/');
            } catch(error) {
                dispatch({
                    type: REGISTER_FAILURE,
                    payload: {
                      error: error
                    }
                });
                console.error("There was an error!", error);
            }
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        signUp();
    }

    const handleCloseError = () => {
        dispatch({
          type: ERROR_CLOSE
        });
    }

    return (
        <div>
            {!Cookies.get('user_auth') && !authState.isAuthenticated ?
            <div>
                <Navbar />
                <div>
                    {authState.error && <div style={{margin: "auto", textAlign: "center"}} className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <div className="mr-auto">Error</div>
                            <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={handleCloseError}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="toast-body">
                            {authState.error}
                        </div>
                    </div>}
                    <form style={{ width: "45%", margin: "4em auto" }} onSubmit={handleSubmit}>
                        <fieldset>
                            <legend style={{textAlign: "center"}}><h2>Sign Up</h2></legend>
                            <div className="form-group">
                                <label htmlFor="InputFirstName">First Name</label>
                                <input type="text" className="form-control" id="InputFirstName" placeholder="Enter first name" onChange={e => setFirstName(e.target.value)} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="InputLastName">Last Name</label>
                                <input type="text" className="form-control" id="InputLastName" placeholder="Enter last name" onChange={e => setLastName(e.target.value)} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="InputEmail">Email Address</label>
                                <input type="email" className="form-control" id="InputEmail" placeholder="Enter email" onChange={e => setEmail(e.target.value)} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="InputPassword">Password</label>
                                <input type="password" className="form-control" id="InputPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                            </div>
                            <div className="form-group">
                                <label>Already have an account? <Link to="/signin">Sign In</Link></label>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around"}}>
                                <button type="submit" className="btn btn-primary">Sign Up</button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div> :
            <div style={{ textAlign: "center", marginTop: "20em" }}>
                <Loader type="ThreeDots" color="#2BAD60" />
            </div>}
        </div>
    )
}

export default SignUp
