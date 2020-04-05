import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useContext, useState } from "react";
import { useHistory, Link } from 'react-router-dom';
import { useInterval } from '../api/common';
import { AuthContext } from "./App";
import Cookies from 'js-cookie';
import Loader from "react-loader-spinner";

function Watchlist() {

    let mounted = true;
    const { state: authState, dispatch } = useContext(AuthContext);
    const [page, setPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const history = useHistory();

    useEffect(() => {
        mounted = true;
        checkSignedIn();
        return () => {
            mounted = false;
        };
    }, []);

    useInterval(() => {
        checkSignedIn();
    }, 500);

    const checkSignedIn = () => {
        if(!Cookies.get('user_auth')) {
            history.push('/');
        }
    };

    const updateUser = async (updatedUser) => {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('user_auth')
            },
            body: JSON.stringify(updatedUser),
            credentials: 'include'
        };
        try {
            let response = await fetch('http://localhost:8000/api/users/me', requestOptions);
            let data = await response.json();
            if (!response.ok) {
                const error = (data && data.detail) ? data.detail : response.status;
                if (mounted) {
                    setErrorMessage(error);
                }
                console.error("There was an error!", error);
                return;
            }
            if (mounted) {
                setErrorMessage('');
            }
            dispatch({
                type: "LOGIN",
                payload: {
                    user: updatedUser
                }
            });
            let lastPageNum = Math.floor((updatedUser.watchlist.length - 1)/10);
            if(mounted && page > lastPageNum) {
                setPage(lastPageNum);
            }
        } catch(error) {
            if (mounted) {
                setErrorMessage(error);
            }
            console.error("There was an error!", error);
        }
    }
    
    const deleteFromWatchlist = ele => {
        let eleIndex = authState.user.watchlist.indexOf(ele);
        let tmp = JSON.parse(JSON.stringify(authState.user));
        tmp.watchlist.splice(eleIndex, 1);
        updateUser(tmp);
    }

    const createList = () => {
        let rows = [];
        let start = page * 10;
        let end = Math.min(authState.user.watchlist.length, start + 10);
        for(let i = start; i < end; i++) {
            rows.push(
                <Link key={i} to={`/crypto/${authState.user.watchlist[i]}USDT`} className="list-group-item list-group-item-action">
                    {authState.user.watchlist[i]}
                </Link>);
        }
        return rows
    }

    const createDeleteButtons = () => {
        let buttons = [];
        let start = page * 10;
        let end = Math.min(authState.user.watchlist.length, start + 10);
        for(let i = start; i < end; i++) {
            buttons.push(
                <i 
                style={{color: "red", cursor:"pointer", margin: "0.85em 0"}}
                className="fa fa-times-circle fa-lg"
                data-toggle="tooltip" data-placement="top" title=""
                data-original-title="Remove from watchlist"
                onClick={() => deleteFromWatchlist(authState.user.watchlist[i])}></i>);
        }
        return buttons
    }

    const handleRightClick = () => {
        let lastPageNum = Math.floor((authState.user.watchlist.length - 1)/10);
        if(page == lastPageNum) {
            setPage(0);
        } else {
            setPage(page + 1);
        }
    }

    const handleLeftClick = () => {
        if(page == 0) {
            let lastPageNum = Math.floor((authState.user.watchlist.length - 1)/10);
            setPage(lastPageNum);
        } else {
            setPage(page - 1);
        }
    }

    return (
        <div style={{ textAlign: "center" }}>
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
            {Object.keys(authState.user).length > 0 && authState.user.watchlist.length > 0 &&
                <div>
                    <h1 style={{ marginTop: "2em" }}>Watchlist</h1>
                    <div style={{ width: "60%", margin: "4em auto", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <ul className="pagination pagination-lg">
                            <li className="page-item">
                                <a className="page-link" href="#" onClick={handleLeftClick}>&laquo;</a>
                            </li>
                        </ul>
                        <div style={{display: "flex", width: "60%", alignItems: "center", justifyContent: "space-around"}}>
                            <div style={{ width: "80%" }} className="list-group">
                                {createList()}
                            </div>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexFlow: "column"}}>
                                {createDeleteButtons()}
                            </div>
                        </div>
                        <ul className="pagination pagination-lg">
                            <li className="page-item">
                                <a className="page-link" href="#" onClick={handleRightClick}>&raquo;</a>
                            </li>
                        </ul>
                    </div>
                </div>
            }
            {Object.keys(authState.user).length > 0 && authState.user.watchlist.length == 0 &&
                <h1 style={{ marginTop: "7em" }}>There's nothing on your watchlist...</h1>
            }
            {Object.keys(authState.user).length == 0 && 
            <div style={{ marginTop: "14em" }}>
                <Loader type="ThreeDots" color="#2BAD60" />
            </div>}
        </div>
    )
}

export default Watchlist
