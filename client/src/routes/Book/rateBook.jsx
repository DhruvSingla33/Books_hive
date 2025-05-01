import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RateBook({ userId }) {
  const navigate = useNavigate();
  const { id } = useParams();  // book ID from route
  const [rating, setRating] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const rateBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/books/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, rating }),
      });
      console.log(response);
      if (response.ok) {
        setRating("");
        setSubmitted(true);

      } else {
        alert("already rated");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      // alert(error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h3>Give a rating</h3>

      {submitted ? (
        <p>Rating submitted successfully!</p>
      ) : (
        <form
          className="bookdetails"
          onSubmit={rateBook}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Rating (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>

          <input
            type="submit"
            value="Submit Rating"
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          />
        </form>
      )}
    </div>
  );
}

export default RateBook;
