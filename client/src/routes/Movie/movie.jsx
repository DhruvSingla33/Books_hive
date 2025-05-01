import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsFillFileEarmarkPlusFill } from "react-icons/bs"
import background from "./bg.jpg";



function Movie() {
    const baseUrl = "http://localhost:8000/api/movies";
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = baseUrl;
                if(selectedCategory) {
                    url += `?category=${selectedCategory}`
                }
                const res = await fetch(url);
                if(!res.ok) {
                    throw new Error("Nothing in Movies");
                }
                const jsonData = await res.json();
                setData(jsonData);
                setIsLoading(false);
                
            } catch (error) {
                console.log(error);
                setError("Error fecthing Movie Data");
                setIsLoading(false);
            }
        }
        fetchData();
    }, [selectedCategory])


  return (
    <div>
        <h1>Movies</h1>
        <p style={{color:"cyan"}}>Movies are just a thrill to watch. Watching <span style={{color:"lightgreen"}}>a really good Movie 
        that connects to you is one of the best feelings ever.</span>
        Here I will just put on some really good movies, <span style={{color:"lightgreen"}}>
        animated and non-animated</span> both, that I belive everyone should watch.</p><br />
        <img src={background} alt='sunrise' style={{borderRadius:"5px"}} />
        <p style={{fontSize:"11px", textAlign:"center"}}>Art by <span><a href='https://www.deviantart.com/aenami' target='_blank'>@aenami</a></span></p>

        <br />
        
        <Link to="/createmovie" ><BsFillFileEarmarkPlusFill size={20} /> Add New Movie</Link>

        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

        <div className="filters"> <br />
            <label style={{color:"cyan"}}>Sort by: </label>
                <select onChange={(e)=> setSelectedCategory(e.target.value)}>
                <option value="">All</option>
                <option value="romance">Romance</option>
                <option value="mystery">Mystery</option>
                <option value="action">Action</option>
                <option value="food">Food</option>
                <option value="adventure">Adventure</option>
                <option value="thriller">Thriller</option>
                <option value="comedy">Comedy</option>
                <option value="other">other</option>
                </select>
      </div>

      {isLoading ? (
        <p>Loading....</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className='books'>
            {data.map((item) => (
                <li key={item._id}>
                    <Link to={`/movies/${item.slug}`}>
                        <img
                            src={`http://localhost:8000/uploads/${item.thumbnail}`}
                               alt={item.title} />
                        <h3>{item.title}<br/><span style={{fontSize:"10px"}}>{item.createdAt.slice(0,10)}</span></h3>
                        <h5></h5>
                    </Link>
                </li>
            ))}
        </ul>
      )}

    </div>
  )
}

export default Movie