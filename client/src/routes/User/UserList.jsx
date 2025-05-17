import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
 
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetch(`${BASE_URL}/getdata`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          const teachers = data.data.filter(user => user.userInfo?.userType === "Teacher");
          setUsers(teachers);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", fontSize: "1.25rem", fontWeight: "bold", color: "#2563eb" }}>
        Loading users...
      </p>
    );
  }

  const containerStyle = {
    padding: "2rem",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #ffffff, #f8fafc, #dbeafe)",
  };

  const gridStyle = {
    display: "grid",
    gap: "2rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  };

  const cardStyle = {
    border: "2px solid #93c5fd",
    borderRadius: "1rem",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.3s ease",
  };

  const infoBoxStyle = {
    backgroundColor: "#f9fafb",
    border: "1px solid #d1d5db",
    borderRadius: "0.75rem",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
  };

  const headingStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: "0.5rem",
  };

  const textStyle = {
    fontSize: "0.875rem",
    color: "#4b5563",
    marginBottom: "0.5rem",
  };

  const roleStyle = {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#16a34a",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.5rem 1rem",
    fontWeight: "600",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.75rem",
    cursor: "pointer",
    marginBottom: "0.5rem",
    transition: "background 0.3s ease",
  };

  const viewButton = {
    ...buttonStyle,
    backgroundColor: "#3b82f6",
  };

  const messageButton = {
    ...buttonStyle,
    backgroundColor: "#6366f1",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "800", marginBottom: "2rem", color: "#1e3a8a" }}>
        Teacher Profiles
      </h2>

      <div style={gridStyle}>
        {users.map((user) => (
          <div key={user.userInfo._id} style={cardStyle}>
            <div style={infoBoxStyle}>
              <h3 style={headingStyle}>
                {user.userInfo.fname} {user.userInfo.lname}
              </h3>
              <p style={textStyle}>{user.userInfo.email}</p>
              <p style={roleStyle}>Role: {user.userInfo.userType}</p>
            </div>

            <div>
              <Link to={`/users/${user.userInfo._id}`}>
                <button style={viewButton}>View Profile</button>
              </Link>
              <Link to={`/chat/${user.userInfo._id}`}>
                <button style={messageButton}>Message</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
