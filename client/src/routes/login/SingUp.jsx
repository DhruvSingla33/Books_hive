import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // Reusing Login.css
import sideImage from '../../assets/SideImage001.png';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const endpoint = "/register";

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === "Admin" && secretKey !== "Admin@123") {
      alert("Invalid Admin");
    } else if (userType === "Teacher" && secretKey !== "Teacher@123") {
      alert("Invalid Teacher");
    } else {
      fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          email,
          lname,
          password,
          userType,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            alert("Registration Successful");
          } else {
            alert("Something went wrong");
          }
        });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-left">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label>Register As:</label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              {["User", "Admin", "Teacher"].map((type) => (
                <label
                  key={type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.9rem",
                  }}
                >
                  <input
                    type="radio"
                    name="UserType"
                    value={type}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  {type}
                </label>
              ))}
            </div>

            {(userType === "Admin" || userType === "Teacher") && (
              <>
                <label>Secret Key</label>
                <input
                  type="password"
                  placeholder="Secret Key"
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </>
            )}

            <label>First Name</label>
            <input
              type="text"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
            />

            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Sign Up</button>

            <p style={{ marginTop: "15px" }}>
              Already registered? <Link to="/sign-in">Sign In</Link>
            </p>
          </form>
        </div>
        <div className="auth-right">
          <img src={sideImage} alt="Background" />
          <h3>Join the community today!</h3>
          <p>
            Collaborate, learn, and grow with our platform built for users,
            teachers, and admins.
          </p>
        </div>
      </div>
    </div>
  );
}
