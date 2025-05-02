import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    fetch("https://dev-minds-1.onrender.com/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
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
    '::placeholder': {
      color: '#ccc'
    }
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
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Sign In</h3>

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            style={inputStyle}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            style={inputStyle}
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
            Login
          </button>

          <p style={{ textAlign: "center", marginTop: "10px", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <a href="/Signup" style={{ color: "#fff", textDecoration: "underline" }}>
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
