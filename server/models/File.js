const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: String,
  type: String, // "file" or "folder"
  path: String,
  parent: String
});

module.exports = mongoose.model("File", fileSchema);