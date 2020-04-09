import "bootswatch/dist/lux/bootstrap.min.css";
import React, { useEffect, useContext, useState } from "react";
import OverlayTrigger  from 'react-bootstrap/OverlayTrigger';
import Tooltip  from 'react-bootstrap/Tooltip';
import { useHistory, Link } from 'react-router-dom';
import { useInterval } from '../common';
import { UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE } from '../constants/auth';
import { updateUser } from '../api';
import { AuthContext } from "./App";
import Navbar from "./Navbar";
import Loader from "react-loader-spinner";

function Watchlist() {

    let mounted = true;
    const { state: authState, dispatch } = useContext(AuthContext);
    const [page, setPage] = useState(0);
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
        if(authState.applicationMounted && !authState.isAuthenticated) {
            history.push('/');
        }
    };

    const update = updatedUser => {
        updateUser(updatedUser).then(() => {
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: {
                    user: updatedUser
                }
            });
            let lastPageNum = Math.floor((updatedUser.watchlist.length - 1)/10);
            if(mounted && page > lastPageNum) {
                setPage(lastPageNum);
            }
        }).catch(error => {
            dispatch({
                type: UPDATE_USER_FAILURE,
                payload: {
                    error: error
                }
            });
            console.error("There was an error!", error);
        });
      }
    
    const deleteFromWatchlist = ele => {
        let eleIndex = authState.user.watchlist.indexOf(ele);
        let tmp = JSON.parse(JSON.stringify(authState.user));
        tmp.watchlist.splice(eleIndex, 1);
        update(tmp);
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
                <OverlayTrigger
                    key={`top${i}`}
                    placement="top"
                    overlay={
                        <Tooltip id='tooltip-top'>
                            Remove from watchlist
                        </Tooltip>
                    }
                >
                    <i key={i}
                    style={{color: "red", cursor:"pointer", margin: "0.85em 0"}}
                    className="fa fa-times-circle fa-lg"
                    data-toggle="tooltip" data-placement="top" title=""
                    data-original-title="Remove from watchlist"
                    onClick={() => deleteFromWatchlist(authState.user.watchlist[i])}></i>
                </OverlayTrigger>);
        }
        return buttons
    }

    const handleRightClick = () => {
        let lastPageNum = Math.floor((authState.user.watchlist.length - 1)/10);
        if(page === lastPageNum) {
            setPage(0);
        } else {
            setPage(page + 1);
        }
    }

    const handleLeftClick = () => {
        if(page === 0) {
            let lastPageNum = Math.floor((authState.user.watchlist.length - 1)/10);
            setPage(lastPageNum);
        } else {
            setPage(page - 1);
        }
    }

    return (
        <div>
            {authState.applicationMounted && authState.isAuthenticated && Object.keys(authState.user).length > 0 ?
            <div>
                <Navbar />
                <div style={{ textAlign: "center" }}>
                    {authState.user.watchlist.length > 0 &&
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
                    {authState.user.watchlist.length === 0 &&
                        <h1 style={{ marginTop: "7em" }}>There's nothing on your watchlist...</h1>
                    }
                </div>
            </div> :
            <div style={{ textAlign: "center", marginTop: "20em" }}>
                <Loader type="ThreeDots" color="#2BAD60" />
            </div>}
        </div>
    )
}

export default Watchlist
