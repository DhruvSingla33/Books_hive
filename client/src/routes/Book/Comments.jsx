import React, { useState } from "react";
import { FaThumbsUp, FaReply } from "react-icons/fa";
import "./Comment.css"; // Import the CSS

const CommentSection = ({ bookId, comments = [], userData, refresh }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [commentText, setCommentText] = useState("");

  const postComment = async () => {
    if (!commentText.trim()) return;

    const res = await fetch(`${BASE_URL}/api/books/${bookId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.name || userData.email,
        text: commentText,
      }),
    });

    const result = await res.json();
    if (result.message === "Comment added") {
      setCommentText("");
      refresh();
      alert("Comment added");
    } else {
      alert("Failed to post comment");
    }
  };

  return (
    <div className="comment-section">
      <h2 className="comment-heading">{comments.length} Comments</h2>

      <form className="comment-form" onSubmit={(e) => {
        e.preventDefault();
        postComment();
      }}>
        <div className="comment-avatar">
          {userData.name?.charAt(0).toUpperCase() || userData.email?.charAt(0).toUpperCase()}
        </div>
        <input
          type="text"
          className="comment-input"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="comment-button">Comment</button>
      </form>

      <div className="comment-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <div className="comment-avatar">
              {comment.username.charAt(0).toUpperCase()}
            </div>
            <div className="comment-content">
              <div className="comment-meta">
                <strong>{comment.username}</strong>
                <small> • {new Date(comment.date).toLocaleDateString()}</small>
              </div>
              <p className="comment-text">{comment.text}</p>
             
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
