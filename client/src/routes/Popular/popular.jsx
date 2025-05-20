import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import './popular.css';

function Popular() {
     const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const baseUrl = `${BASE_URL}/api/books`;
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const top = [];
 
    useEffect(() => {
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
    }, [selectedCategory])

    data.forEach((item) => {
        // const score = item.rating_count !== 0 ? item.book_rating / item.rating_count : 1;
        const score = item.rating_count ? item.book_rating / item.rating_count : 0;

        top.push([score, item.title, item.thumbnail,item._id,item.rating_count,item.book_rating]);
    });
    
    top.sort((a, b) => b[0]-a[0]);

  return (
    <div>
        <h1>Popular Books</h1>
        

       


        <div className="popular-container">
  {top.map(([score, title, image, id, rating_count, rating]) => (
    <Link to={`../books/${id}`} key={id} className="books-card">
      <img
        src={`${image}`}
        alt={title}
        className="books-image"
      />
      <div className="books-content">
        <h3 className="books-title">{title}</h3>
        <p className="books-rating">
          Rating: <strong>{score.toFixed(2)}</strong> ⭐ ({rating_count} votes)
        </p>
      </div>
    </Link>
  ))}
</div> 

        
   

        

    </div>
  )
}

export default Popular