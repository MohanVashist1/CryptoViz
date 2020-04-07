import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link } from 'react-router-dom';
import { useInterval } from '../common/common';
import { REGISTER_FAILURE, REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE, ERROR_CLOSE } from '../constants/auth';
import Navbar from "./Navbar";
import { AuthContext } from "./App";
import { register, login } from '../api/api';
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

    const signUp = e => {
        e.preventDefault();
            register(email, password, firstName, lastName).then(() => {
                dispatch({
                    type: REGISTER_SUCCESS
                });
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
            }).catch(error => {
                dispatch({
                    type: REGISTER_FAILURE,
                    payload: {
                      error: error
                    }
                });
                console.error("There was an error!", error);
            });
    };

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
                    <form style={{ width: "45%", margin: "4em auto" }} onSubmit={signUp}>
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
