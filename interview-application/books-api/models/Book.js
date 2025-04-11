const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    genre: String,
    author: String,
    read: Boolean
})
module.exports = mongoose.model("Books", BookSchema, "Books");