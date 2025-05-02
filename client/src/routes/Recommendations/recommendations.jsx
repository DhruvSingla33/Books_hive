import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import bg from "./recc.jpg";
import { ContainerPropsProvider } from "@chakra-ui/react";

function Recommendations() {
    const baseUrl = "http://localhost:8000/api/books";
    const BASE_URL = "https://dev-minds-1.onrender.com";
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
        fetch(`http://127.0.0.1:5000/hybrid_recommend?book_name=${encodedBookName}`)
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
            setError(err.message);
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
        fetch(`http://127.0.0.1:5000/recommend1?book_name=${encodedBookName}`)
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
            setError(err.message);
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
        <div>
            <h2 style={{ color: "lightgreen" }}>Search Engine for Books: </h2>
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            {searchTerm !== "" && (
                <div className="search-results-container">
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

            <h1 style={{ color: "violet" }}>Recommendation System</h1>
            <span style={{ color: "cyan" }}>
                <li><u>Data Collection and Preprocessing:</u></li>
            </span> Gather and clean user data, such as preferences and interactions with items.
            <br /><br />
            <span style={{ color: "cyan" }}>
                <li><u>User and Item Representation:</u></li>
            </span> Create structured profiles for users and items, often using techniques like embeddings or matrix factorization.
            <br /><br />
            <span style={{ color: "cyan" }}>
                <li><u>Data Splitting:</u></li>
            </span> Divide the data into training, validation, and test sets for model evaluation.
            <br /><br />
            <span style={{ color: "cyan" }}>
                <li><u>Recommendation Algorithms:</u></li>
            </span> Choose the core algorithms for making recommendations, like Collaborative Filtering or Content-Based Filtering.
            <br /><br />
            <span style={{ color: "lightgreen" }}>
                These components work together to build a recommendation system that suggests items to users based on their preferences and behavior.
            </span>
            <br /><br /><br />
            <img src={bg} alt="girl-with-sword" style={{ borderRadius: "5px" ,width:"1200px"}} /> <br /><br />
            <div className="p-4">
      

      
    </div>
    <h1 style={{ marginTop: "200px" }} className="text-xl font-bold mb-4">
  content based Recommendations
</h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit1} className="mb-4">
          <input
            type="text"
            value={bookName1}
            onChange={handleInputChange1}
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
        {collrecommendations.length === 0 && !error ? (
          <p>No recommendations available yet.</p>
        ) : (
          <div className="search-results-container">
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
        
      
        <h1 style={{ marginTop: "200px" }} className="text-xl font-bold mb-4">
  Hybrid Recommendations
</h1>



      {/* Input Form */}
      <form onSubmit={handleSubmit2} className="mb-4">
        <input
          type="text"
          value={bookName2}
          onChange={handleInputChange2}
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
      {hybridrecommendations.length === 0 && !error ? (
        <p>No recommendations available yet.</p>
      ) : (
        <div className="search-results-container">
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
