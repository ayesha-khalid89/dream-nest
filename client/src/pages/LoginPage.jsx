import React, { useState } from "react";
import "../styles/login.scss";
import { setLogin } from "../redux/state";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
  const dispatch=useDispatch()
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const response=await fetch('http://localhost:3001/auth/login',{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
      })
      const loggedin=await response.json()
      if (loggedin){
        dispatch(
          setLogin({
            user:loggedin.user,
            token:loggedin.token
          })
        )
        navigate("/");
      }
    }catch(err){
    console.log("login failed",err.message)
    }
  }
  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">LOG IN</button>
        </form>
        <a href="/register">Dont have an account? Sign up here.</a>
      </div>
    </div>
  );
};

export default LoginPage;
