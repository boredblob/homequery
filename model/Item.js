const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 50
  }, 
  type: {
    type: String,
    required: true
  }
});

module.exports = itemSchema;