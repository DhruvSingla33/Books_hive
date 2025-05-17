import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"


function Edit() {
  
    const baseUrl = "http://localhost:8000/api/books";
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
      const filteredResults = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setSearchResults(filteredResults);
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
  }, [selectedCategory, searchTerm, data])

  return (
    <div>
    <h2 style={{"color": "lightgreen"}}>Search Books to Edit: </h2>
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {searchTerm !== '' && (
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


    </div>
  )
}

export default Edit