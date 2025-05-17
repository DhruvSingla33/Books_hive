import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Userchat() {
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Step 1: Get user ID from token
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const res = await fetch(`${BASE_URL}/userData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!data || !data.data || !data.data._id) throw new Error("Invalid user data");

        setUserId(data.data._id);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  // Step 2: Once we have the userId, fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`${BASE_URL}/api/chats/byuserid`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        setChats(data);
        console.log(data);
      } catch (err) {
        setError("Failed to fetch chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#4CAF50" }}>Your Chats</h2>
      {chats.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chats.map((chat) => {
            const otherUser = chat.users.find((u) => u._id !== userId);

            return (
              <li key={chat._id} style={{ marginBottom: "10px" }}>
                <Link
                  to={`/chat/${otherUser?._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ padding: 10, border: "1px solid #ccc", borderRadius: "5px" }}>
                    <p><strong>Chat with:</strong> {otherUser?.fname || "Unknown"}</p>
                    <p>{chat.latestMessage?.content || "No messages yet."}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No chats found.</p>
      )}
    </div>
  );
}

export default Userchat;
