import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { BsPencilSquare } from "react-icons/bs"

function singleMovie() {
    
    const [data, setData] = useState([]);
    const urlSlug = useParams();
    const baseUrl = `http://localhost:8000/api/movies/${urlSlug.slug}`;

    useEffect(() => {
        const fetchData = async() => {
            try {

                const response = await fetch(baseUrl);
                if(!response.ok) {
                    throw new Error("Try Again Failed to fetch Data");
                }

                const jsonData= await response.json();
                setData(jsonData);

            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])


    function StarRating({ numberOfStars} ) {
        const stars = [];
    
        for(let i = 0; i < numberOfStars; i++ ) {
          stars.push(<span key={i}>⭐</span>)
        }
    
        return <div>Rating: {stars}</div>
      }

  return (
    <div>
    <h3>Details</h3>
    
    <Link to={"/movies"}>🔙 Movies</Link>

    <div className="bookdetails">
    <div className="col-1">
        <img src={`http://localhost:8000/uploads/${data?.thumbnail}`}
        alt={data?.title} />
        <Link to={`/editmovie/${data.slug}`}><BsPencilSquare size={20} /></Link>
    </div>

    <div className="col-2">
        <h1>{data?.title}</h1>
        <p>{data?.description}</p>
        <StarRating numberOfStars={data?.stars} />

        <p>Category</p>
        <ul>
        {data?.category?.map((item, index)=> (
            <li key={index}>{item}</li>
        ))}
        </ul>
    </div>

    </div>

    </div>
  )
}

export default singleMovie