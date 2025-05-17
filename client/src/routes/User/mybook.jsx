import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

function UserDetail(props) {
  const [userData, setUserData] = useState(null);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetch(`${BASE_URL}/getdata/${props.propValue}`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email: window.localStorage.getItem("email"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data.data);
      });
  }, []);   

  const containerStyle = {
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    maxWidth: "1200px",
    margin: "0 auto",
    borderRadius: "8px",
  };

  const headingStyle = {
    color: "#333",
    fontSize: "1.6rem",
    marginBottom: "1rem",
  };

  const userInfoStyle = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
  };

  const infoTextStyle = {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "1rem",
  };

  const booksContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
    paddingTop: "1.5rem",
  };

  const bookCardStyle = {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const bookCardHoverStyle = {
    transform: "translateY(-5px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const thumbnailStyle = {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "1rem",
  };

  const bookTitleStyle = {
    fontSize: "1.2rem",
    color: "#333",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    textAlign: "center",
  };

  const statusStyle = {
    fontSize: "1rem",
    color: "#007bff",
    textAlign: "center",
    marginTop: "0.5rem",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  const loadingTextStyle = {
    fontSize: "1.2rem",
    color: "#888",
    textAlign: "center",
    marginTop: "2rem",
  };

  return (
    <div style={containerStyle}>
      {userData ? (
        <div style={userInfoStyle}>
          <h2 style={headingStyle}>User Info:</h2>
          <p style={infoTextStyle}>Name: {userData.userInfo.fname} {userData.userInfo.lname}</p>
          <p style={infoTextStyle}>Email: {userData.userInfo.email}</p>

          <h2 style={headingStyle}>Issued Books:</h2>
          <div style={booksContainerStyle}>
            {userData.issuedBooks.map((book) => (
              <div key={book._id} style={bookCardStyle}>
                <Link to={`/books/${book._id}`} style={linkStyle}>
                  <img
                    src={`${BASE_URL}/uploads/${book.thumbnail}`}
                    alt={book.title}
                    style={thumbnailStyle}
                  />
                  <h3 style={bookTitleStyle}>{book.title}</h3>
                  <h3 style={statusStyle}>Status: {book.status}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={loadingTextStyle}>Loading user data...</p>
      )}
    </div>
  );
}

export default UserDetail;
