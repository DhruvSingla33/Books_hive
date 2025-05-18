import React, { Component, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import './admin.css'; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const endpoint = "/userdata";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        if (data.data.userType == "Admin") {
          setAdmin(true);
        }
      
        setUserData(data.data);

        if (data.data == "token expired") {
          alert("Token expired login again");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      });
  }, []);

  return (
  <div className="admin-page-wrapper">
    {admin ? (
      <div>
        <h2>Welcome Admin</h2>
        <NavLink to="/createbook" className="booklink">Create Book</NavLink>
        <NavLink to="/edit" className="booklink">Edit Book</NavLink>
        <NavLink to="/issuebook" className="booklink">Issue Book</NavLink>
      </div>
    ) : (
      <div className="not-admin-container">
        <h2 className="not-admin-title">Access Denied</h2>
        <p className="not-admin-text">
          You do not have administrative privileges to access this page.
        </p>
        <div className="not-admin-buttons">
          <Link to="/" className="not-admin-button home">Go to Homepage</Link>
          <Link to="/sign-in" className="not-admin-button signin">Sign In as Admin</Link>
        </div>
      </div>
    )}
  </div>
);

}
