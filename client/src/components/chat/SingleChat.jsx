import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import "./SingleChat.css";
import io from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_API_BASE_URL; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket;
const user ={};
const SingleChat = () => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [Chat, setChat]=useState(null);
  const [User,setUser]=useState({});
  const [UserId,setUserId]=useState(null);
  const { id } = useParams();

  // const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    const fetchMessages = async () => {
      if (!Chat) return;
  
      try {
        setLoading(true);
        const { data } = await axios.get(`${ENDPOINT}/api/message/${Chat._id}`);
        setMessages(data);
        setLoading(false);
        socket.emit("join chat", Chat._id);
      } catch (error) {
        console.error("Error fetching messages", error);
        setLoading(false);
      }
    };
  
    fetchMessages();
  }, [Chat]); 

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  

  useEffect(() => {
    
    
      fetch(`${ENDPOINT}/userData`, {
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
          
          setUser(data.data);
         
          console.log(data);
          setUserId(data.data._id);
          console.log(UserId);
        });
  
    }, [Chat]);
      
  
    useEffect(() => {
      const getOrCreateChat = async () => {
        console.log(id);
        if (!UserId || !id) return; // wait until both are available
    
        try {
          const { data } = await axios.post(`${ENDPOINT}/chat`, {
            userId: UserId,
            user2Id:id,
          });
          // console.log(user2Id);
          console.log(UserId);
          setChat(data);
          console.log(Chat);
          setLoading(false);

        } catch (error) {
          console.log("hiiii");
          console.error("Error fetching/creating chat:", error);
          setLoading(false);
        }
      };
    
      getOrCreateChat();
    }, [UserId, id]); // 🔁 will run again when these are set
    useEffect(() => {
      const messageListener = (newMessageRecieved) => {
        if (!Chat || Chat._id !== newMessageRecieved.chat._id) return;
    
        // ✅ Skip if message is from the current user
        if (newMessageRecieved.sender._id === UserId) return;
    
        setMessages((prevMessages) => {
          const exists = prevMessages.some((msg) => msg._id === newMessageRecieved._id);
          return exists ? prevMessages : [...prevMessages, newMessageRecieved];
        });
      };
    
      socket.on("message recieved", messageListener);
    
      return () => {
        socket.off("message recieved", messageListener);
      };
    }, [Chat, UserId]);
    
    
    


  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      // socket.emit("stop typing", selectedChat._id);
      
        setNewMessage("");
        try {
          const { data } = await axios.post(`${ENDPOINT}/api/message`, {
            content: newMessage,
            chatId: Chat._id,
            userId:UserId,
          });
          console.log(data);
          setMessages([...messages, data]);
          socket.emit("new message", data);
        } catch (error) {
          // console.log("hiiii");
          console.error("Error fetching/creating chat:", error);
         
          // setLoading(false);
        };
      }};
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", Chat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", Chat._id);
        setTyping(false);
      }
    }, timerLength);
  };
return (<>

<h1 className="chat-heading">💬 real-Time Chat with Socket.IO</h1>

<div className="chat-container">
  <div className="messages-area">
    {messages.length === 0 ? (
      <div className="no-messages">No messages yet. Start the conversation!</div>
    ) : (
      <div className="messages">
        <ScrollableChat messages={messages} user={User} />
      </div>
    )}
  </div>

  <div className="custom-input-wrapper" onKeyDown={sendMessage}>
    {istyping && (
      <div className="typing-indicator">
        <Lottie
          options={defaultOptions}
          width={70}
          style={{ marginBottom: 15, marginLeft: 0 }}
        />
      </div>
    )}
    <input
      type="text"
      className="custom-chat-input"
      placeholder="Type your message..."
      value={newMessage}
      onChange={typingHandler}
    />
  </div>
</div>

</>)};


export default SingleChat;