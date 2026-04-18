const mongoose = require("mongoose");

// const fileSchema = new mongoose.Schema({
//   name: String,
//   type: String, // "file" or "folder"
//   path: String,
//   parent: String
// });

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  path: String,
  subject: String,
  parent: String,
  parentName: String
});

module.exports = mongoose.model("File", fileSchema);