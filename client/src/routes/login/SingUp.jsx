import React, { useState } from "react";
import "./signup.css"; // Keep your CSS for responsiveness or shared styles
const BASE_URL = "https://dev-minds-1.onrender.com";
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

  const pageStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const formCard = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    padding: "30px 25px",
    borderRadius: "15px",
    width: "90%",
    maxWidth: "360px",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
  };

  const labelStyle = {
    fontWeight: 500,
    fontSize: "0.9rem",
    marginTop: "10px",
  };

  return (
    <div style={pageStyle}>
      <div style={formCard}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Sign Up</h3>

          <label style={labelStyle}>Register As:</label>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
  {["User", "Admin", "Teacher"].map((type) => (
    <label
      key={type}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "0.9rem",
        color: "#fff",
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
              <label style={labelStyle}>Secret Key</label>
              <input
                type="password"
                style={inputStyle}
                placeholder="Secret Key"
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </>
          )}

          <label style={labelStyle}>First Name</label>
          <input
            type="text"
            style={inputStyle}
            placeholder="First name"
            onChange={(e) => setFname(e.target.value)}
          />

          <label style={labelStyle}>Last Name</label>
          <input
            type="text"
            style={inputStyle}
            placeholder="Last name"
            onChange={(e) => setLname(e.target.value)}
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            style={inputStyle}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              background: "#ffc107",
              border: "none",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>

          <p style={{ textAlign: "center", marginTop: "10px", fontSize: "0.9rem" }}>
            Already registered?{" "}
            <a href="/sign-in" style={{ color: "#fff", textDecoration: "underline" }}>
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
