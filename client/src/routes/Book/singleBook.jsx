import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { BsPencilSquare } from "react-icons/bs"
import RateBook from "./rateBook";
import './singlebook.css';
import CommentSection from "./Comments";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const endpoint = "/api/books/";

function singleBook() {
    const [showComponent, setShowComponent] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const handleButtonClick = () => {
      setShowComponent(true);
    }
    const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);
  const [teacher,setTeacher ]= useState(false);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const baseUrl = `${BASE_URL}${endpoint}${id}`;
  

  useEffect(() => {
    const fetchData = async() => {
        try {

            const response = await fetch(baseUrl);
            if(!response.ok) {
                throw new Error("Try Again Failed to fetch Data");
            }

            const jsonData= await response.json();
            setData(jsonData);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    // `${BASE_URL}/userData`
    fetchData();
    fetch(`${BASE_URL}/userData`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data, "userData");
        if (data.data.userType == "Admin") {
          setAdmin(true);
        }
        if (data.data.userType == "Teacher") {
          setTeacher(true);
        }
        
    
        setUserData(data.data);
    
      });

  }, [refreshData]);
    


   


    function StarRating({ numberOfStars} ) {
        const stars = [];
    
        for(let i = 0; i < numberOfStars; i++ ) {
          stars.push(<span key={i}>⭐</span>)
        }
    
        return <div>Rating: {stars}</div>
      }


      function issueBook(e) {
        e.preventDefault();
    const useremail=userData.email;


        // console.log(email, password);
        fetch(`${BASE_URL}/issuebook`, {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            useremail,
              id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "userRegister");
            if (data.status == "ok") {
              alert("Issue request send successfully");
             
    
            }
            else{
                alert("issue unsuccessful"); 
            }
          });
      }
      function suggestBook(e) {
        e.preventDefault();
    const useremail=userData.email;


        // console.log(email, password);
        fetch(`${BASE_URL}/suggestbook`, {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            useremail,
           id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "userRegister");
            if (data.status == "ok") {
              alert("Suggest send successfully");
             
    
            }
            else{
                alert("Suggest unsuccessful"); 
            }
          });
      };
     
    
      
      

  return (
   
   <div className="book-details-wrapper">

  {/* TOP SECTION */}
  <div className="book-top-section">
    <div className="book-left-column">
      <img
        src={`${data?.thumbnail}`}
        alt={data?.title}
        className="book-thumbnail"
      />

      {data?.pdf && (
        <a
          href={`${BASE_URL}/uploads/${data?.pdf}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pdf-button"
        >
          📄 View PDF
        </a>
      )}

      {(admin || teacher) ? null : (
        <div className="action-button-container">
          <button onClick={issueBook} className="primary-button">
            Issue
          </button>
        </div>
      )}

      {teacher && (
        <div className="action-button-container">
          <button onClick={suggestBook} className="primary-button">
            Suggest Book
          </button>
        </div>
      )}
    </div>

    <div className="book-right-column">
  <h1 className="book-title1">{data?.title}</h1>

  {data?.book_author && (
    <p className="book-author1">
      <strong>Author:</strong> {data.book_author}
    </p>
  )}

  {data?.description && (
    <p className="book-description1">
      <strong>Discription:</strong> {data.description}
      </p>
  )}

  {(data?.book_rating || data?.rating_count) && (
    <div className="book-rating-info">
   
      {data?.rating_count > 0 ? (
  <p>
    <strong>Average Rating:</strong>{" "}
    {(data.book_rating / data.rating_count).toFixed(1)} ⭐
  </p>
) : (
  <p>
    <strong>Average Rating:</strong> N/A ⭐
  </p>
)}

<p>
  <strong>Rated by:</strong> {data?.rating_count || 0} user(s)
</p>
     
    </div>
  )}

 
  {data?.category?.length > 0 && (
    <>
      <p className="category-heading1">Categories</p>
      <ul className="category-list1">
        {data.category.map((item, index) => (
          <li key={index} className="category-chip1">
            {item}
          </li>
        ))}
      </ul>
    </>
  )}

  {admin ? (
    <Link to={`/editbook/${data._id}`} className="edit-book-link">
      Edit Book <BsPencilSquare size={20} />
    </Link>
  ) : (
       <>
       </>
     ) }
  


  <Link to="/books" className="back-link">🔙 Back to Books</Link>
</div>

  </div>

  {/* BOTTOM SECTION */}
  <div className="book-bottom-section">
    
    <CommentSection
      bookId={id}
      comments={data?.comments || []}
      userData={userData}
      refresh={() => setRefreshData(prev => !prev)}
    />
     <RateBook userId={userData._id} />
  </div>

</div>


  )
}

export default singleBook