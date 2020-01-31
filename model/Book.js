const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 50
  }
});

module.exports = mongoose.model("Book", bookSchema);