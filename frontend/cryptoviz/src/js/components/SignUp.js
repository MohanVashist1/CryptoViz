import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link } from 'react-router-dom';
import { useInterval } from '../common';
import { REGISTER_FAILURE, REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE } from '../constants/auth';
import Navbar from "./Navbar";
import { AuthContext } from "./App";
import { register, login } from '../api';
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
        if(authState.applicationMounted && authState.isAuthenticated) {
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

    return (
        <div>
            {authState.applicationMounted && !authState.isAuthenticated && Object.keys(authState.user).length === 0 ?
            <div>
                <Navbar />
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
            </div> :
            <div style={{ textAlign: "center", marginTop: "20em" }}>
                <Loader type="ThreeDots" color="#2BAD60" />
            </div>}
        </div>
    )
}

export default SignUp
