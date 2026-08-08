//import React from 'react'

const Login = () => {
  return (
    <div className="login-ctr">
        <h4>Login to Glass <img className="login-logo" src="/glass-logo.svg" alt="" /></h4>
        <input type="text" className="form-control mb-2" placeholder="Username" />
        <input type="password" className="form-control mb-3" placeholder="Password" />
        <button className="btn btn-success w-100" type="button">Login</button>
    </div>
  )
}

export default Login