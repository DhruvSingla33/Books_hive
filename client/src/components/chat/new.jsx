import React, { useState } from 'react';

const BookRecommendations = () => {
  const [bookName, setBookName] = useState(""); // To store user input
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  // Handle input change
  const handleInputChange = (event) => {
    setBookName(event.target.value);
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission default behavior (page refresh)
    
    if (bookName.trim() === "") {
      setError("Please enter a book name.");
      return;
    }

    const encodedBookName = encodeURIComponent(bookName);

    fetch(`http://127.0.0.1:5000/recommend?book_name=${encodedBookName}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        return res.json();
      })
      .then((data) => {
        setRecommendations(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Something went wrong while fetching recommendations.');
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Book Recommendations</h1>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={bookName}
          onChange={handleInputChange}
          placeholder="Enter book name"
          className="border p-2 rounded"
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Get Recommendations
        </button>
      </form>

      {/* Display Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Recommendations */}
      {recommendations.length === 0 && !error ? (
        <p>No recommendations available yet.</p>
      ) : (
        <ul className="list-disc pl-6">
          {recommendations.map((book, index) => (
            <li key={index} className="mb-2">
              <strong>{book[0]}</strong> by {book[1]} (Book ID: {book[2]})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookRecommendations;
