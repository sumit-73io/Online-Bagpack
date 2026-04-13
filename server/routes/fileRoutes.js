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






// file System Logic
router.post("/folder", async (req, res) => {
  const { name, subject, parent } = req.body;

  const folder = new File({
    name,
    type: "folder",
    subject,
    parent: parent || null
  });

  await folder.save();
  res.json(folder);
});

router.post("/upload", upload.single("file"), async (req, res) => {
  const { subject, parent } = req.body;

  const newFile = new File({
    name: req.file.originalname,
    type: "file",
    path: req.file.path,
    subject,
    parent: parent || null
  });

  await newFile.save();
  res.json(newFile);
});



// Create folder from the top menu
async function createFolder() {
  const name = prompt("Folder name:");
  if (!name) return;

  await fetch("http://localhost:5000/api/files/folder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      subject: currentSubject,
      parent: currentFolder
    })
  });

  loadFiles();
}




router.get("/", async (req, res) => {
  const { subject, parent } = req.query;

  const files = await File.find({
    subject,
    parent: parent || null
  });

  res.json(files);
});
