import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"


function Popular() {
    const baseUrl = "http://localhost:8000/api/books";
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
        const score = item.book_rating / item.rating_count 
        top.push([score, item.title, item.thumbnail,item._id,item.rating_count,item.book_rating]);
    });
    
    top.sort((a, b) => b[0]-a[0]);

  return (
    <div>
        <h1>Popular Books</h1>
        {/* <pre>{JSON.stringify(data)}</pre> */}

        {/* <ul className="books">
            {data.map((item) => (
                <li key={item._id}>
                <Link to={`/books/${item.slug}`}>
                    <img
                    src={`http://localhost:8000/uploads/${item.thumbnail}`}
                    alt={item.title}
                    />
                    <h3>{item.title} ➡️ {item.stars} ⭐</h3>
                </Link>

                </li>
            ))}
            </ul>  */}


        <ul className="books">
        {top.map(([score, title, image,id,rating_count,rating]) => (
            <li key={id}>
                <Link to={`../books/${id}`}>
                <img
            src={`http://localhost:8000/uploads/${image}`}
            alt={title}
            />
            <h4>{title} ➡️ {score} {rating_count},{rating} ⭐</h4>
                                                </Link>
            
            

            </li>
        ))}
        </ul> 

        
        {/* <ul style={{color:"violet"}}>
            {top.map(([stars, title, image]) => (
                <li key={title}>
                {title} - {stars}
                
                </li>
            ))}
        </ul> */}

        

    </div>
  )
}

export default Popular