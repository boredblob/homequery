const mongoose = require("mongoose");

const dvdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 30
  }
});

module.exports = mongoose.model("DVD", dvdSchema);