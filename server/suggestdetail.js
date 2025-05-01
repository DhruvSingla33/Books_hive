
const mongoose = require('mongoose');

const SuggestRequestSchema = new mongoose.Schema({
  userName: {
    type: String,

  },
  bookName: {
    type: String,

  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo', 

  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  
  },
 
});

module.exports = mongoose.model('SuggestRequest', SuggestRequestSchema);
