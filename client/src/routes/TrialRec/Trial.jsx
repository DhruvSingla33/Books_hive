import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BsFillFileEarmarkPlusFill } from "react-icons/bs"
import Fuse from 'fuse.js'; // Import Fuse library
// import * as math from 'mathjs'; // You'll need a library like math.js for matrix operations





function Trial() {


    const baseUrl = "http://localhost:8000/api/books";
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [fuse, setFuse] = useState(null);
    const [cosineSimilarityMatrix, setCosineSimilarityMatrix] = useState([]);


    // const top = [];
 
    useEffect(() => {
        setFuse(
          new Fuse(data, {
            keys: ['title'], // Search in the 'title' property
            threshold: 0.5,   // Adjust the threshold as needed (0.5 means 50% similarity)
          })
        );
        const fetchData = async() => {
            try {
                
                let url = baseUrl;
                if(selectedCategory) {
                url += `?category=${selectedCategory}`
                }

                const response = await fetch(url);
                if(!response.ok) {
                    throw new Error("Try Again Failed to fetch Data");
                }

                const jsonData= await response.json();
                setData(jsonData);
                setIsLoading(false);


            } catch (error) {
                console.log(error);
                setError("Error fecthing Data lol");
                setIsLoading(false);
            }
        }
        fetchData();
    }, [selectedCategory, data])



    const [searchTitle, setSearchTitle] = useState('');
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    const findBooksByTitle = () => {
        if (!fuse) {
          return; // Return if the data is not loaded yet
        }
        const searchResults = fuse.search(searchTitle);

    if (searchResults.length === 0) {
      setRecommendedBooks(["No books found with that title."]);
      return;
    }

    // Extract categories from the search results
    const categories = searchResults[0].item.category;

    // Filter recommended books based on categories
        const filteredBooks = data.filter((book) =>
        book.category &&
        book.rating !== 0 &&
        book.category.some((cat) => categories.includes(cat))
      );

      // Check if there are any books left after filtering
      if (filteredBooks.length === 1) {
        setRecommendedBooks(["NO BOOKS"]);
      } else {
        setRecommendedBooks(filteredBooks);
      }
    }




  return (
    <div>
      <h1>Book Search and Recommendations</h1>
      <input
      type="text"
      placeholder="Search by book title"
      value={searchTitle}
      onChange={(e) => setSearchTitle(e.target.value)}
    />
    <button onClick={findBooksByTitle}>Search</button>
    <h2>Recommended Books:</h2>
    <ul>
      {recommendedBooks.length === 1 || recommendedBooks[0] === "NO BOOKS" || recommendedBooks.length === 0 ? (
        <h2>NO BOOKS</h2>
      ) : (
        recommendedBooks.map((book, index) => (
          <li key={index}>
            <h2>{book.title}</h2>
            <img
            src={`http://localhost:8000/uploads/${book.thumbnail}`}
            alt={book.title} style={{width:"10%"}}
            />
            <p>Categories: {book.category.join(', ')}</p>
          </li>
        ))
      )}
    </ul>
    </div>
  )
}

export default Trial