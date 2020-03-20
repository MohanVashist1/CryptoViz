import React from 'react'

function Login() {
    return (
        <form style={{ width: "50%", margin: "auto", marginTop: "20vh" }}>
            <fieldset>
                <legend style={{ textAlign: "center" }}><h2>Login / Sign Up</h2></legend>
                <div className="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around"}}>
                    <button type="submit" className="btn btn-primary">Log In</button>
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>
            </fieldset>
        </form>
    )
}

export default Login
