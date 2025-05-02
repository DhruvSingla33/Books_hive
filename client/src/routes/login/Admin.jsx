import React, { Component, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import './admin.css'; 
// import AdminHome from "./adminHome";

// import UserHome from "./userHome";
const BASE_URL = "https://dev-minds-1.onrender.com";
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
       else{
        window.location.href = "./sign-in";
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
    <>
    {/* <h1> 
    ddjejejj
    </h1> */}
      {admin ? (
        <div>
  <h2>Welcome Admin</h2>
  <NavLink to="/createbook" className="booklink">
    Create Book
  </NavLink>
  <NavLink to="/edit" className="booklink">
    Edit Book
  </NavLink>
  <NavLink to="/issuebook" className="booklink">
    Issue Book
  </NavLink>
</div>

      ) : <>
      {/* <Link to="/createbook">Go to Another Page</Link> */}
      
        <h1>Not a Admin</h1>
      </>}

    </>
  )
  ;
}
