import React, { useState, useEffect } from 'react';
// import jwt from 'jsonwebtoken';


function Details() {
 
  
    // Retrieve the user info JSON string from localStorage
const userInfoStrin = window.localStorage.getItem('token');
const userInfo = JSON.parse(userInfoStrin);

   
// console.log(token)
  return (
    <div>
      <h1>{userInfo.email}</h1>
      <h1>{userInfo.password}</h1>
      
    </div>
  );
}

export default Details;
