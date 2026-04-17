const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const fileRoutes = require("./routes/fileRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const path = require("path");

console.log("Static path:", path.join(__dirname, "uploads"));
// static setup
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/backpack")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));