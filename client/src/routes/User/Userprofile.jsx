import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import './mybook.css';

function Userprofile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getuserdata/${id}`, {
          method: "POST",  // ✅ Keep POST if your backend requires it
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email: window.localStorage.getItem("email"),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log(data, "userData");

        setUserData(data.data);  // ✅ Set the actual data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);  // ✅ Fetch only when 'id' changes

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="user-details-container">
      {/* <h1>{userData?.userInfo?.lname || "No Last Name"}</h1> */}

      <div className="user-info">
        <h2>User Info:</h2>
        <p>Name: {userData?.userInfo?.fname} {userData?.userInfo?.lname}</p>
        <p>Email: {userData?.userInfo?.email}</p>
        <p>User Type: {userData?.userInfo?.userType}</p>

        <h2>Suggested Books:</h2>
        <div className="issued-books-container">
          {userData?.suggestBooks?.length > 0 ? (
            userData.suggestBooks.map((book) => (
              <div key={book._id} className="issued-book">
                <Link to={`/books/${book._id}`} className="book-link">
                  <img
                    src={`http://localhost:8000/uploads/${book.thumbnail}`}
                    alt={book.title}
                    className="book-thumbnail"
                  />
                  <h3 className="book-title">{book.title}</h3>
                  {/* <h3 className="book-title">Status: {book.status}</h3> */}
                </Link>
              </div>
            ))
          ) : (
            <p>No Suggested book.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Userprofile;
