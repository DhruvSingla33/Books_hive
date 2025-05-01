import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BsFillFileEarmarkPlusFill } from "react-icons/bs"
import bg from "./wallpaperflare.com_wallpaper (29).jpg"

function Book() {
    const baseUrl = "http://localhost:8000/api/animes";
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");




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


  return (
    <div>
        <h1 style={{color:"cyan"}}>Anime</h1>
        <p>Anime, pronounced <span style={{color:"lightgreen"}}>AH-nee-may</span>, is a style of Japanese animated entertainment that has become 
        increasingly popular around the world in recent years.
        The word <span style={{color:"lightgreen"}}>anime</span> is a shortened 
        form of the Japanese word <span style={{color:"lightgreen"}}>animēshon</span>, which means "animation." While anime has its 
        <span style={{color:"lightgreen"}}> roots in Japan</span>, 
        it has since <span style={{color:"lightgreen"}}>spread to other countries</span>, and today, anime can be found in many <span style={{color:"lightgreen"}}>
        different languages
        </span>, including English.</p> 
        <img src={bg} alt="girl-with-umbrella" style={{borderRadius:"5px"}} />
        <br />
        <p style={{fontSize:"11px", textAlign:"center"}}>Art by <a href="https://www.pixiv.net/en/artworks/64364428" target="_blank">@たん旦</a></p> <br />

        <Link to="/createanime"><BsFillFileEarmarkPlusFill size={20} /> Add New Anime</Link>

        <h2>My Anime List</h2>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}


        <div className="filters">
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
            <ul className="books">
            {data.map((item) => (
                <li key={item._id}>
                <Link to={`/about/${item.slug}`}>
                    <img
                    src={`http://localhost:8000/uploads/${item.thumbnail}`}
                    alt={item.title}
                    />
                    <h3>{item.title}</h3>
                </Link>
                </li>
            ))}
            </ul> 
        )}


    </div>
  )
}

export default Book