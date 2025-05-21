import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import sideImage from "../../assets/SideImage.png";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  function handleSubmit(e) {
    if (e) e.preventDefault(); 
    setLoading(true);

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
        setLoading(false);
        if (data.status === "ok") {
          alert("Login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          window.localStorage.setItem("email", email);
          navigate("/");

        } else {
          alert("Invalid credentials");
        }
      })
      .catch((err) => {
        setLoading(false);
        alert("Something went wrong. Try again later.");
        console.error(err);
      });
  }

  // Trigger login after filling sample creds
  useEffect(() => {
    if (autoLogin && email && password) {
      handleSubmit();
      setAutoLogin(false);
    }
  }, [email, password, autoLogin]);

  // Sample login filler
  const useSampleLogin = (role) => {
    if (role === "student") {
      setEmail("singladhruv24@gmail.com");
      setPassword("1234");
      setAutoLogin(true);
    } else if (role === "teacher") {
      setEmail("yogita@123gmail.com");
      setPassword("1234");
      setAutoLogin(true);
    }
  };

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="sample-buttons">
              <button
                type="button"
                className="sample-login-btn student"
                onClick={() => useSampleLogin("student")}
                disabled={loading}
              >
                Student Sample Login
              </button>
              <button
                type="button"
                className="sample-login-btn teacher"
                onClick={() => useSampleLogin("teacher")}
                disabled={loading}
              >
                Teacher Sample Login
              </button>
            </div>

            <p>
              Don't have an account? <Link to="/Signup">Sign Up</Link>
            </p>
          </form>
        </div>

        <div className="auth-right">
          <img src={sideImage} alt="BookHive Visual" />
          <h3>Welcome to BookHive</h3>
          <p>
            Explore, recommend, and manage books in a collaborative reading environment.
            <br /><br />
            <strong>Note for Recruiters:</strong> You can skip sign-up and directly log in using the <em>sample account</em>.
          </p>
        </div>
      </div>
    </div>
  );
}
