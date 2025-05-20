import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Rating.css';
function RateBook({ userId }) {
  const navigate = useNavigate();
  const { id } = useParams();  // book ID from route
  const [rating, setRating] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const rateBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/books/${id}/rate`, {
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
        alert("This Book Is Already rated by You");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      // alert(error);
    }
  };

  return (
    <div className="rating-container">
  <h3 className="rating-heading">Give a Rating</h3>

  {submitted ? (
    <p className="rating-success-message">✅ Rating submitted successfully!</p>
  ) : (
    <form className="rating-form" onSubmit={rateBook}>
      <div className="rating-input-group">
        <label htmlFor="rating">Rating (1–10):</label>
        <input
          id="rating"
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="rating-submit-button">
        Submit Rating
      </button>
    </form>
  )}
</div>

  );
}

export default RateBook;
