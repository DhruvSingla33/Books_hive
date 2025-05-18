import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import sideImage from '../../assets/SideImage001.png';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${BASE_URL}/login-user`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert("Login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          window.localStorage.setItem("email", email);
          window.location.href = "./";
        } else {
          alert("Invalid credentials");
        }
      });
  }

  return (
    <div className="auth-wrapper">
    <div className="auth-container">
      <div className="auth-left">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
          <p>
            Don't have an account?{" "}
            <Link to="/Signup">Sign Up</Link>
          </p>
        </form>
      </div>
      <div className="auth-right">
        <img src={sideImage} alt="Background" />
        <h3>New opportunities for cooperation</h3>
        <p>
          An easy way to manage your files, create groups of orders,
          and send them to different places.
        </p>
      </div>
    </div>
    </div>
  );
}
