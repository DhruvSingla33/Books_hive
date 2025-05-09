import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { BsPencilSquare } from "react-icons/bs"
import RateBook from "./rateBook";
import './singlebook.css';
const BASE_URL = "https://dev-minds-1.onrender.com";
const endpoint = "/api/books/";

function singleBook() {
    const [showComponent, setShowComponent] = useState(false);
    const [commentText, setCommentText] = useState("");
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
    fetchData();
    fetch("http://localhost:8000/userData", {
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
        fetch("http://localhost:8000/issuebook", {
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
        fetch("http://localhost:8000/suggestbook", {
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
      const postComment = async () => {
        console.log("hii");
        const res = await fetch(`http://localhost:8000/api/books/${id}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.name || userData.email,  // or username if available
            text: commentText,
          }),
        });
      
        const result = await res.json();
        if (result.message === "Comment added") {
          setCommentText("");
          setRefreshData(prev => !prev); // 🔁 trigger re-fetch
          alert("comment added");
        } else {
          alert("Failed to post comment");
        }
      
      };
      
      

  return (
    <div className="user-details-container">
  
 
  {/* Rest of your component */}

  <h1 className="user-type">{userData.userType}</h1>
  <div className="book-details">
    <div className="col-1">
      <img
        src={`${BASE_URL}/uploads/${data?.thumbnail}`}
        alt={data?.title}
        className="book-thumbnail"
      />
        {data?.pdf && (
    <a
      href={`http://localhost:8000/uploads/${data.pdf}`}
      target="_blank"
      rel="noopener noreferrer"
      className="pdf-link"
    >
      📄 View PDF
    </a>
  )}
      {(admin|| teacher) ? (
       <>

       </>
      ) : ( 
      <div className="button-container">
        <button onClick={issueBook} className="issue-button">
          Issue
        </button>
      </div>)}
      {(teacher) ? (
       <div className="button-container">
       <button onClick={suggestBook} className="issue-button">
         Suggest Book
       </button>
     </div>
      ) : ( <>
      </>
      )}
    </div>

    <div className="col-2">
      <h1 className="book-title">Book Title: {data?.title}</h1>
      <p className="book-description">{data?.description}</p>
      {/* <h1 className="user-email">{userData.email}</h1> */}
      <StarRating numberOfStars={data?.stars} />
      <p className="category-title">Category</p>
      <ul className="category-list">
      
        {data?.category?.map((item, index) => (
          <li key={index} className="category-item">
             {item}
          </li>
        ))}

      </ul>
      {admin ? (
        <Link to={`/editbook/${data._id}`} className="edit-book-link">
          Edit Book <BsPencilSquare size={20} />
        </Link>
      ) : (
        
        <div>
      
      <div className="button-container">
        {setShowComponent ? (
          <RateBook  userId={userData._id}/>
        ) : (
          <button onClick={handleButtonClick} className="rate-book-button">
            hoti 
          </button>
        )}
      </div>
    </div>
          
        
          
        
      )}
    </div>
  </div>
  <Link to="/books" className="link-back">🔙 Books</Link>
  

  <div
  className="comment-section"
  style={{
    marginTop: "2rem",
    padding: "1.5rem",
    backgroundColor:  "#6CB4EE",
    borderRadius: "12px",
    maxWidth: "800px",
    margin: "2rem auto",
  }}
>
  <h2 style={{ marginBottom: "1rem", color: "#333" }}>Comments</h2>

  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (!commentText) return;
      postComment();
    }}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      marginBottom: "1.5rem",
    }}
  >
    <textarea
      rows="3"
      placeholder="Write a comment..."
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      style={{
        padding: "0.75rem",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        resize: "vertical",
      }}
    />
    <button
      type="submit"
      style={{
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "6px",
        fontSize: "1rem",
        cursor: "pointer",
        alignSelf: "flex-start",
      }}
    >
      Post Comment
    </button>
  </form>

  <div
    className="comment-list"
    style={{
      backgroundColor: "#fff",
      padding: "1rem",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    }}
  >
    {data?.comments?.length > 0 ? (
  data.comments.map((comment, index) => (
    <div
      key={index}
      className="comment-item"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#e6f0ff",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      }}
    >
      {/* Profile Circle / Initial */}
      <div
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "1rem",
          flexShrink: 0,
        }}
      >
        {comment.username.charAt(0).toUpperCase()}
      </div>

      {/* Comment Content */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: "0.3rem" }}>
          <strong style={{ color: "#333", fontSize: "1rem" }}>
            {comment.username}
          </strong>
          <small style={{ marginLeft: "0.5rem", color: "#888" }}>
            {new Date(comment.date).toLocaleString()}
          </small>
        </div>
        <p style={{ margin: 0, color: "#444", fontSize: "0.95rem" }}>
          {comment.text}
        </p>
      </div>
    </div>
  ))
) : (
  <p style={{ color: "#777" }}>No comments yet.</p>
)}

  </div>
</div>
</div>

  )
}

export default singleBook