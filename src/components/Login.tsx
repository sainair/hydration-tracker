//import React from 'react'
import { useState } from "react";

interface LoginProps{
    onLogin: (token: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {

    const API="http://localhost:8000"

    const[login, setLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");

    const handleCreate = async () => {
        setError("");
        if(pass!==confirmPass)
        {
            setError("Passwords do not match!")
            return;
        }
        const res = await fetch(`${API}/users/`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password: pass})
        });

        const data = await res.json();

        if(!res.ok){
            setError(data.detail)
            return;
        }

        setError("");
        setUsername("");
        setPass("");
        setConfirmPass("");
        setLogin(true);        
    }

    const handleLogin = async () => {
        setError("");
        if (!username || !pass){
            setError("Enter all credentials!")
            return;
        }

        const res =await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password: pass})
        });

        const data = await res.json();

        if (!res.ok){
            setError(data.detail);
            return;
        }

        onLogin(data.access_token);

    }

  if(login === false){
    return(
        <>
            <div className="welcome">
                <p>Welcome to Glass<img src="/glass-logo.svg" /></p>
            </div>
            <div className="create-ctr">
                <h4>Create an account</h4>
                <input type="text" className="form-control mb-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" className="form-control mb-3" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)}/>
                <input type="password" className="form-control mb-3" placeholder="Confirm Password" value={confirmPass} onChange={ (e) => setConfirmPass(e.target.value)}/>
                <button className="btn btn-success w-100" type="button" onClick={handleCreate}>Create</button>
                <p className ="create-p">Have an account? <button className='btn create-btn' type="button" onClick={() => setLogin(true)}>Login</button></p>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </>
    )
  }

  return (

    <>
        <div className="welcome">
            <p>Welcome to Glass! <img src='/glass-logo.svg'/></p>
        </div>
        <div className="login-ctr">
            <h4>Login to Glass</h4>
            <input type="text" className="form-control mb-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" className="form-control mb-3" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)}/>
            <button className="btn btn-success w-100" type="button" onClick={handleLogin}>Login</button>
            <p className ="create-p">Don't have an account? <button className='btn create-btn' type="button" onClick={() => setLogin(false)}>Create one</button></p>
        </div>
    </>
  )
}

export default Login