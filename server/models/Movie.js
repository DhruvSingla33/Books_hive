const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String, 
    },
    slug: {
        type: String,
        // required: true,
    },
    thumbnail: {
        type: String,
    },
    stars: {
        type: Number,
    },
    category: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

});

module.exports = mongoose.model('Movie', MovieSchema);