import './IssueBookList.css';
import React, { useState, useEffect } from 'react';

function IssueBookListComponent() {
  const [issueRequests, setIssueRequests] = useState([]);

  const handleDelete = (issueRequestId) => {
    // Send a DELETE request to the server to delete the issue request
    fetch(`http://localhost:8000/api/issue-requests/${issueRequestId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Remove the deleted issue request from the local state
        setIssueRequests((prevIssueRequests) =>
          prevIssueRequests.filter((request) => request._id !== issueRequestId)
        );
      })
      .catch((error) => {
        console.error('Error deleting issue request:', error);
      });
  };
  const handleIssue = (issueRequestId) => {
    // Send a DELETE request to the server to delete the issue request
    console.log("hiiiiiii");
    fetch(`http://localhost:8000/api/issued/${issueRequestId}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          console.log("hiiiiipppi");
          throw new Error('Network response was not ok');
          
        }
        alert("Book Issued");
        handleDelete(issueRequestId);
      })
      .catch((error) => {
        console.log("hello");
        console.error('Error deleting issue request:', error);
      });
      console.log("hotta");
  };

  useEffect(() => {
    // Fetch issue book data from the server
    fetch('http://localhost:8000/api/issue')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
          
        }
        return response.json();
     
      })
      .then((data) => {
   
        setIssueRequests(data);
        // handleIssue(issueRequest._id)
      })
      .catch((error) => {
        console.error('Error fetching issue book data:', error);
      });
  }, []);

  return (
    <div className="issue-list">
    <h1>Issue Book List</h1>
    <ul>
      {issueRequests.map((issueRequest) => (
        <li key={issueRequest._id}>
          User: {issueRequest.userName}, Book: {issueRequest.bookName}
          <div>

          </div>
          <div>
            
          </div>
          <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
            
          <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
            
          <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
            
          <div>
            
            </div>
            <div>
            
            </div>
            <div>
            
            </div>
          <button onClick={() => handleDelete(issueRequest._id)} className="delete-button">
            Delete
          </button>
          <button onClick={() => handleIssue(issueRequest._id)} className="issue-button">
            Issue
          </button>
        </li>
      ))}
    </ul>
  </div>
  );
}

export default IssueBookListComponent;
