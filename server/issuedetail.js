
const mongoose = require('mongoose');

const IssueRequestSchema = new mongoose.Schema({
  userName: {
    type: String,

  },
  bookName: {
    type: String,

  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo', // Reference to the User model

  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to the Book model
  
  },
 
  // You can add more fields as needed, such as due date, status, etc.
});

module.exports = mongoose.model('IssueRequest', IssueRequestSchema);
