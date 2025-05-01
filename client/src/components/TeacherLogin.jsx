import React, { useState, useEffect } from "react";

const TeacherLogin = () => {
  const [teacherId, setTeacherId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");
    if (storedLoggedIn === "true") {
      setLoggedIn(true);
    }
  }, []);

  const loginAsTeacher = () => {
    if (teacherId === "9999" || teacherId === "7272") {
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true"); 
    } else {
        console.error("Err");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    localStorage.setItem("loggedIn", "false"); 
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <p>Logged in as a teacher.</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <label htmlFor="teacherId">Enter Teacher ID: </label>
          <p style={{textAlign:"right", display:"flex", margin:"2px"}}>
          <input
            type="text"
            id="teacherId"
            placeholder="Enter your teacher ID"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          />
          <button onClick={loginAsTeacher} style={{padding:"2px", marginLeft:"5px"}}>Login</button></p>
        </div>
      )}
    </div>
  );
};

export default TeacherLogin;
