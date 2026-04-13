const express = require("express");
const router = express.Router();
const multer = require("multer");
const File = require("../models/File");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* Upload File */
router.post("/upload", upload.single("file"), async (req, res) => {
  const newFile = new File({
    name: req.file.originalname,
    type: "file",
    path: req.file.path
  });

  await newFile.save();
  res.json(newFile);
});

/* Create Folder */
router.post("/folder", async (req, res) => {
  const folder = new File({
    name: req.body.name,
    type: "folder"
  });

  await folder.save();
  res.json(folder);
});

/* Get All */
router.get("/", async (req, res) => {
  const files = await File.find();
  res.json(files);
});

/* Delete */
router.delete("/:id", async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* Rename */
router.put("/:id", async (req, res) => {
  const updated = await File.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  res.json(updated);
});

module.exports = router;