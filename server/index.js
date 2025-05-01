require("dotenv").config();
const mongoose = require("mongoose");
const cors= require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Book = require("./models/Books");

const Movie = require("./models/Movie");
const Message = require("./models/Message");
const Chat = require("./models/Chat");
const multer = require("multer");
const User = require("./userDetails");
const IssueRequest = require('./issuedetail'); 
const SuggestRequest = require('./suggestdetail'); 

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require("bcryptjs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');




const jwt = require("jsonwebtoken");
// var nodemailer = require("nodemailer");



// POST FOR POSTING
// PUT FOR UPDATING
// GET FOR FETCHING
// DELETE FOR DELETING
// PATCH = PUT BUT SPECIFIC UPDATE NOT EVERYTHING
// HEAD = GET BUT FETCHES/REQUESTS ONLY HEADERS. NO CONTENT
// TRACE = FOR DEBUGGING. GET TRACES
// OPTIONS = PROVIDES WITH A MENU OF ACTIONS POSSIBLE WITH ALL THESE

const app = express();
app.set("view engine", "ejs");
const PORT = process.env.PORT || 8000;


connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true } ));
app.use(express.json());
app.use("/uploads", express.static("uploads"));



app.get("/api/movies", async (req, res) => {
  try {
    const category = req.query.category;
    
    const filter = {};
    if(category) {
      filter.category = category;
    }

    const data = await Movie.find(filter);
    if(!data) {
      throw new Error("Error occurred while fetching Movies");
    }
    res.status(201).json(data);

  } catch (error) {
    res.status(500).json({error: "Error occurred while fetching Movies"});
  }
})

app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      
      return res.json({ error: "User Exists" });
    }
    console.log(fname);
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "45m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});
app.get('/getdata', async (req, res) => {
  try {
    const users = await User.find().populate("suggestBooks.bookId"); // Populate book details

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const allUsersData = users.map(user => ({
      userInfo: user,
      suggestBooks: user.suggestBooks.map(suggestBook => ({
        ...suggestBook.bookId.toObject(),  // Convert book to plain object
        status: suggestBook.status,
      }))
    }));
    console.log(allUsersData);
    return res.json({ status: "ok", data: allUsersData });

  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/getuserdata/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    console.log("Fetching user data...");
    
    // Corrected query
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get issued books
    const suggestBooks = user.suggestBooks;
    const bookIds = suggestBooks.map((suggestBook) => suggestBook.bookId);

    // Find books by bookId array
    const books = await Book.find({ _id: { $in: bookIds } });

    // Merge books with status
    const booksWithStatus = suggestBooks.map((suggestBook) => {
      const matchingBook = books.find((book) => book._id.equals(suggestBook.bookId));
      return {
        ...matchingBook.toObject(),
        status: suggestBook.status,
      };
    });

    const userData = {
      userInfo: user,
      suggestBooks: booksWithStatus,
    };

    console.log("User data fetched successfully", userData);

    return res.status(200).json({ status: "ok", data: userData });

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/api/chats/byuserid", async (req, res) => {
  const { userId } = req.body;
  try {
    const chats = await Chat.find({ users: userId })
      .populate("users", "fname email")
      .populate("latestMessage");

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).send("Server error");
  }
});

// Add a comment to a book by slug
app.post("/api/books/:id/comments", async (req, res) => {
  // console.log("aati");
  // console.log(req);
  const { username, text } = req.body;

  try {
    const book = await Book.findById(req.params.id);


    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const newComment = {
      username,
      text,
      date: new Date(),
    };

    book.comments.push(newComment);
    console.log(book);
    await book.save();

    res.status(201).json({ message: "Comment added", book });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.post('/getdata/:id', async (req, res) => {
  try {
    const userEmail = req.params.id;
    const emails=req.body.email;
    console.log(emails);
    console.log(userEmail );
    console.log("fite" );
    const user = await User.findOne({ email:emails });
    console.log(user);
    console.log("hi");

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
// console.log(user.issuedBooks);

// const books = [];
const issuedBooks=user.issuedBooks;
const bookIds = issuedBooks.map((issuedBook) => issuedBook.bookId);
    
    // Find books by the array of bookId values
    // console.log( bookIds);
    // console.log(issuedBooks);
    const books = await Book.find({ _id: { $in: bookIds } });
    // const bookIds = issuedBooks.map((issuedBook) => issuedBook.bookId);

    // // Find books by the array of bookId values
    // const books = await Book.find({ _id: { $in: bookIds } });
    
    // Merge status with corresponding books
    const booksWithStatus = issuedBooks.map((issuedBook) => {
      const matchingBook = books.find((book) => book._id.equals(issuedBook.bookId));
      return {
        ...matchingBook.toObject(), // Convert Mongoose document to plain object
        status: issuedBook.status,
      };
    });
    
    console.log(booksWithStatus);
    

// console.log(bookStatusMap);

    const userData = {
      userInfo: user,
      issuedBooks: booksWithStatus,
    };
    // const data=json(userData);
    console.log(userData);

    if (res.status(201)) {
      return res.json({ status: "ok", data: userData });
    } else {
      return res.json({ error: "error" });
    }
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post("/issuebook", async (req, res) => {
  const { useremail, id } = req.body;

  try {
    const user = await User.findOne({ email: useremail });
    const book = await Book.findById(id);

    if (!user || !book) {
      return res.status(404).send({ status: "error", message: "User or book not found" });
    }

    // Add book to user's issuedBooks list
    user.issuedBooks.push({
      bookId: book._id,
      status: "Pending",
    });

    await user.save();

    // Create new issue request
    const newIssueRequest = new IssueRequest({
      userName: user.fname,
      bookName: book.title,
      userId: user._id,
      bookId: book._id,
      status: "Pending", // Optional: Add status if you have it in your schema
    });

    await newIssueRequest.save();

    console.log('Issue request saved:', newIssueRequest);

    res.send({ status: "ok", message: "Book issue request submitted successfully" });

  } catch (error) {
    console.error('Error in /issuebook route:', error);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});

app.post("/suggestbook", async (req, res) => {
  const { useremail, id} = req.body;

  try {
    const user = await User.findOne({ email: useremail });
    const book = await Book.findById(id);
    if (!user || !book) {
      return res.status(404).send({ status: "error", message: "User or book not found" });
    }

    user.suggestBooks.push({
      bookId: book._id,
      status: "Pending",
    });

    await user.save();

    const newSuggestRequest = new SuggestRequest({
      userName: user.fname,
      bookName: book.title,
      userId: user._id,
      bookId: book._id,
    });

    await newSuggestRequest.save();

    console.log('Suggestion request saved:', newSuggestRequest);
    res.send({ status: "ok" });

  } catch (error) {
    console.error('Error in /suggestbook:', error);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
});



// Get all issue book data
app.get('/api/issue', async (req, res) => {
  
  try {
    const issueRequests = await IssueRequest.find();
    console.log(issueRequests);
    res.json(issueRequests);
  } catch (error) {
    console.error('Error fetching issue book data:', error);
    console.log('sjj');
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/api/issue-requests/:id', async (req, res) => {
  try {
    const issueRequestId = req.params.id;
    await IssueRequest.findByIdAndDelete(issueRequestId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting issue request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/issued/:id', async (req, res) => {
  try {
    const issueRequestId = req.params.id;
    const data = await IssueRequest.findById(issueRequestId).populate('userId').populate('bookId');

    if (!data) return res.status(404).send("Issue request not found");

    const user = data.userId;
    const book = data.bookId;

    // ✅ Construct dynamic email content
    const mailOptions = {
      from: 'singladhruv301@gmail.com', // Your verified SendGrid sender
      to: user.email, // Recipient's email
      subject: 'Book Issued - Please Collect It 📚',
      text: `Hi ${user.fname}, your book "${book.title}" is issued successfully. Please come and collect the book.`,
      html: `
        <h2>Book Issued Successfully</h2>
        <p>Hi <b>${user.fname}</b>,</p>
        <p>Your book <strong>"${book.title}"</strong> has been issued successfully.</p>
        <p>Please come and collect the book from the library.</p>
        <br />
        <p>– Book Hive Team</p>
      `
    };

    // ✅ Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // ✅ Update status to "done"
    await User.findOneAndUpdate(
      { _id: user._id, 'issuedBooks.bookId': book._id },
      { $set: { 'issuedBooks.$.status': 'done' } },
      { new: true }
    );

    res.status(204).send();

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send("Server error");
  }
});



app.post('/chat',async (req, res) => {
  const { userId ,user2Id} = req.body;
   console.log(userId);
   console.log(user2Id);
  if (!userId ||!user2Id) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // if (userId === user2Id) {
  //   return res.status(400).json({ message: "You cannot create a chat with yourself." });
  // }
  var isChat = await Chat.find({
    
    $and: [
      { users: { $elemMatch: { $eq: user2Id} } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");



  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      
      users: [user2Id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      console.log(FullChat);
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

app.get("/api/books", async (req, res) => {
  try {
    const category = req.query.category;
    //const stars = req.query.stars;

    const filter = {};
    if(category) {
      filter.category = category;
    }

    const data = await Book.find(filter);
    
    if (!data) {
      throw new Error("An error occurred while fetching books.");
    }
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
});


app.post("/api/books/:id/rate", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId, rating } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

  
    const alreadyRated = book.ratings.find((r) => r.userId.toString() === userId);

    if (alreadyRated) {
      
      return res.status(400).json({ error: "You have already rated this book." });
    }
     
     const newRow = `${bookId},${userId},${rating}\n`;

     // Path to CSV file
     const filePath = path.join(__dirname, 'Ratings.csv');
 
     // Append to CSV
     fs.appendFile(filePath, newRow, (err) => {
       if (err) {
         console.error('Error writing to CSV:', err);
       } else {
         console.log('Book added to CSV!');
       }
     });
 
    book.ratings.push({ userId, rating });
    book.book_rating += parseInt(rating);

    book.rating_count += 1;

    await book.save();
    console.log(book);
    res.json({ message: "Rating submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong while submitting the rating." });
  }
});


app.post("/api/message", async(req,res)=>{
  const { content, chatId ,userId} = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: userId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "lname");
    message = await message.populate("chat");
   

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    console.log(message);
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

app.get("/api/message/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "fname")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const data = await Book.findById(bookId);

    if (!data) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the book." });
  }
});



 // Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to create a book with thumbnail + PDF
app.post("/api/books", upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;

    const newBook = new Book({
      title: req.body.title,
      book_author: req.body.book_author,
      description: req.body.description,
      category: req.body.category,
      thumbnail: thumbnailFile ? thumbnailFile.filename : null,
      pdf: pdfFile ? pdfFile.filename : null, // store PDF filename
      book_rating: 0,
      rating_count: 0,
    });

    await newBook.save();

    // CSV Logging
    const newRow = `${newBook._id},${newBook.book_author},${newBook.title}\n`;
    const filePath = path.join(__dirname, 'Books.csv');

    fs.appendFile(filePath, newRow, (err) => {
      if (err) {
        console.error('Error writing to CSV:', err);
      } else {
        console.log('Book added to CSV!');
      }
    });

    res.json("Data Submitted");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the book." });
  }
});




app.put("/api/books", upload.single("thumbnail"), async (req, res) => {
    try {
  
      const bookId = req.body.bookId;
  
      const updateBook = {
        title: req.body.title,
        slug: req.body.slug,
        stars: req.body.stars,
        description: req.body.description,
        category: req.body.category,
      }
  
      if (req.file) {
        updateBook.thumbnail = req.file.filename;
      }
  
      await Book.findByIdAndUpdate(bookId, updateBook)
      res.json("Data Submitted");
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching books." });
    }
  });

 

  
  app.delete("/api/books/:id", async (req, res) => {
    const bookId = req.params.id;
  
    try {
      // 1. Delete from MongoDB
      await Book.deleteOne({ _id: bookId });
  
      // 2. Read the CSV file and filter out the deleted book
      const csvFilePath = path.join(__dirname, 'Books.csv');
      const records = [];
  
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          if (data.BookId !== bookId) { // Assuming BookId in CSV matches MongoDB _id
            records.push(data);
          }
        })
        .on('end', () => {
          // 3. Rewrite the CSV without the deleted book
          const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: Object.keys(records[0] || {}).map(key => ({ id: key, title: key }))
          });
  
          csvWriter.writeRecords(records)
            .then(() => {
              res.json("Successfully deleted book and updated CSV.");
            })
            .catch((err) => {
              console.error("Error writing CSV:", err);
              res.status(500).json({ error: "Failed to update CSV file." });
            });
        });
  
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ error: "Failed to delete book." });
    }
  });












app.get("/", (req, res) => {
    res.json("This is the home page. For testing goto api/books OR api/animes");
});

app.get("*", (req, res) => {
    res.sendStatus("404");
});

const server=app.listen(PORT, () => {
    console.log(`Sever running at Port: ${PORT}`)
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", 
            
  },
});


io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log("hello");
    console.log(chat);
    console.log("hello");
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});






app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:8000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adarsh438tcsckandivali@gmail.com",
        pass: "rmdklolcsmswvyfw",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "thedebugarena@gmail.com",
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) { }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});


app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then(data => {
      res.send({ status: "ok", data: data })
    })

  } catch (error) {

  }
})

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser=allUser.length;
  results.pageCount=Math.ceil(allUser.length/limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results)
})