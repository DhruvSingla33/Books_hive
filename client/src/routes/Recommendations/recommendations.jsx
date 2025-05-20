import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import bg from "./recc.jpg";
import { ContainerPropsProvider } from "@chakra-ui/react";
import './Recomm.css';

function Recommendations() {
    const baseUrl = "http://localhost:8000/api/books";
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const endpoint = "/api/books";

    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
     const [bookName, setBookName] = useState(""); // To store user input
     const [bookName1, setBookName1] = useState("");
     const [bookName2, setBookName2] = useState("");
      const [recommendations, setRecommendations] = useState([]);
      const [collrecommendations, setcollRecommendations] = useState([]);
      const [hybridrecommendations, sethybridRecommendations] = useState([]);
      const [error, setError] = useState(null);
      


      const handleInputChange2 = (event) => {
        setBookName2(event.target.value);
      };
    
      const handleSubmit2 = (event) => {
        event.preventDefault();
        if (bookName2.trim() === "") {
          setError("Please enter a book name.");
          return;
        }
      
        const encodedBookName = encodeURIComponent(bookName2);
        fetch(`${BASE_URL}/hybrid_recommend?book_name=${encodedBookName}`)
          .then((res) => {
            if (res.status === 404) {
              throw new Error("Book not found");
            }
            if (!res.ok) {
              throw new Error("Failed to fetch recommendations");
            }
            return res.json();
          })
          .then((data) => {
            sethybridRecommendations(data);
            setError(null);
          })
          .catch((err) => {
            console.error(err);
         
            if (err.message === "Book not found") {
              alert("Book not found");
            }
          });
      };
      
      // Handle input change
      const handleInputChange1 = (event) => {
        setBookName1(event.target.value);
      };
    
      // Handle form submit
      // const handleSubmit1 = (event) => {
      //   event.preventDefault(); // Prevent form submission default behavior (page refresh)
        
      //   if (bookName1.trim() === "") {
      //     setError("Please enter a book name.");
      //     return;
      //   }
    
      //   const encodedBookName = encodeURIComponent(bookName1);
    
      //   fetch(`http://127.0.0.1:5000/recommend1?book_name=${encodedBookName}`)
      //     .then((res) => {
      //       if (!res.ok) {
      //         throw new Error('Failed to fetch recommendations');
      //       }
      //       return res.json();
      //     })
      //     .then((data) => {
      //       setcollRecommendations(data);
      //       console.log(data);
      //       setError(null);
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //       setError('Something went wrong while fetching recommendations.');
      //     });
      // };
      const handleSubmit1 = (event) => {
        event.preventDefault();
        if (bookName1.trim() === "") {
          setError("Please enter a book name.");
          return;
        }
      
        const encodedBookName = encodeURIComponent(bookName1);
        fetch(`${BASE_URL}/recommend1?book_name=${encodedBookName}`)
          .then((res) => {
            if (res.status === 404) {
              throw new Error("Book not found");
            }
            if (!res.ok) {
              throw new Error("Failed to fetch recommendations");
            }
            return res.json();
          })
          .then((data) => {
            setcollRecommendations(data);
            setError(null);
          })
          .catch((err) => {
            console.error(err);
            // setError(err.message);
            if (err.message === "Book not found") {
              alert("Book not found");
            }
          });
      };
      
      const handleInputChange = (event) => {
        setBookName(event.target.value);
      };
    
      // Handle form submit
      const handleSubmit = (event) => {
        event.preventDefault();
        if (bookName.trim() === "") {
          setError("Please enter a book name.");
          return;
        }
      
        const encodedBookName = encodeURIComponent(bookName);
        fetch(`http://127.0.0.1:5000/recommend?book_name=${encodedBookName}`)
          .then((res) => {
            if (res.status === 404) {
              throw new Error("Book not found");
            }
            if (!res.ok) {
              throw new Error("Failed to fetch recommendations");
            }
            return res.json();
          })
          .then((data) => {
            setRecommendations(data);
            setError(null);
          })
          .catch((err) => {
            console.error(err);
            setError(err.message);
            if (err.message === "Book not found") {
              alert("Book not found");
            }
          });
      };
      
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${BASE_URL}${endpoint}`;
                if (selectedCategory) {
                    url += `?category=${selectedCategory}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const jsonData = await response.json();
                setData(jsonData);
                setSearchResults(jsonData);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setError("Error fetching data");
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchTerm]);

    // Implementing Fuse.js for fuzzy search
    useEffect(() => {
        const fuse = new Fuse(data, {
            keys: ["title"],
            includeScore: true
           
        });

        if (searchTerm === "") {
            setSearchResults(data);
        } else {
            const results = fuse.search(searchTerm);
            setSearchResults(results.map((result) => result.item));
            console.log(searchResults);
        }
    }, [searchTerm, data]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

   
        return (
  <div className="recommendation-container">
    <h2 className="section-title">Search Engine for Books</h2>
    <form className="search-form">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>

    {searchTerm !== "" && (
      <div className="search-results">
        <ul>
          {searchResults.map((item) => (
            <li key={item._id}>
              <Link to={`../books/${item._id}`}>
                <h4>{item.title}</h4>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}

    <section className="recommendation-info">
      <h1>Recommendation System</h1>
      <ul>
        <li><span>Data Collection and Preprocessing:</span> Gather and clean user data.</li>
        <li><span>User and Item Representation:</span> Create profiles using embeddings or matrix factorization.</li>
        <li><span>Data Splitting:</span> Use training, validation, and test sets.</li>
        <li><span>Recommendation Algorithms:</span> Use Collaborative or Content-Based Filtering.</li>
      </ul>
      <p className="note">
        These components build a system that suggests items based on user behavior.
      </p>
    </section>

    <img src={bg} alt="Recommendation Visual" className="hero-image" />

    {/* Content-based */}
    <h2 className="section-subtitle">Content Based Recommendations</h2>
    <form onSubmit={handleSubmit1} className="recommend-form">
      <input
        type="text"
        value={bookName1}
        onChange={handleInputChange1}
        placeholder="Enter book name"
      />
      <button type="submit">Get Recommendations</button>
    </form>
    {error && <p className="error">{error}</p>}
    {collrecommendations.length > 0 && (
      <div className="search-results">
        <ul>
          {collrecommendations.map((item) => (
            <li key={item.book_id}>
              <Link to={`../books/${item.book_id}`}>
                <h4>{item.title}</h4>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Hybrid */}
    <h2 className="section-subtitle">Hybrid Recommendations</h2>
    <form onSubmit={handleSubmit2} className="recommend-form">
      <input
        type="text"
        value={bookName2}
        onChange={handleInputChange2}
        placeholder="Enter book name"
      />
      <button type="submit">Get Recommendations</button>
    </form>
    {error && <p className="error">{error}</p>}
    {hybridrecommendations.length > 0 && (
      <div className="search-results">
        <ul>
          {hybridrecommendations.map((item) => (
            <li key={item.book_id}>
              <Link to={`../books/${item.book_id}`}>
                <h4>{item.title}</h4>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>

    );
}

export default Recommendations;
