const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
    userType: String,
    issuedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book", // Reference to the Book model
        },
        status: String,
      }
       
    ],
    suggestBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book", // Reference to the Book model
        },
        status: String,
      }
       
    ],
  },
  {
    collection: "UserInfo",
  }
);


module.exports = mongoose.model("UserInfo", UserDetailsScehma);