const mongoose = require("mongoose");

const dvdSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 50
  }
});

module.exports = mongoose.model("DVD", dvdSchema);