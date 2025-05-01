const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  book_author: {
    type:String,
  },
  book_rating : {
    type : Number 
  },
  rating_count: {
    type: Number
  },
  pdf: { type: String },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: Number,
    }
  ],

  // ✅ Directly embedded comment objects
  comments: [
    {
      username: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }
  ]
});

module.exports = mongoose.model('Book', BookSchema);
