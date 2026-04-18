const express = require("express");
const router = express.Router();
const multer = require("multer");
const File = require("../models/File");

//kkkkkkkkkkkkk
// const parent = req.body.parent || null;




const path = require("path");


const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* Upload File */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("Saved file at:", req.file.path);

    const subject = req.body.subject || "books";
    const parent = req.body.parent || null;

    console.log("UPLOAD SUBJECT:", subject);

    const newFile = new File({
      name: req.file.originalname,
      type: "file",
      path: "/uploads/" + req.file.filename,
      subject: req.body.subject || "books",
      parent: req.body.parent || null
    });

    await newFile.save();
    res.json(newFile);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* Create Folder */
router.post("/folder", async (req, res) => {
  try {
    const { name, subject, parent } = req.body;

    // const folder = new File({
    //   name,
    //   type: "folder",
    //   subject,
    //   parent: parent || null
    // });

    const folder = new File({
      name,
      type: "folder",
      subject,
      parent: parent || null,
      parentName: req.body.parentName || null
    });

    await folder.save();
    res.json(folder);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* Get Files */
router.get("/", async (req, res) => {
  try {
    const { subject, parent } = req.query;

    let query = {};

    if (subject) query.subject = subject;

    if (!parent || parent === "null" || parent === "") {
      query.parent = null;
    } else {
      query.parent = parent;
    }

    const files = await File.find(query);
    res.json(files);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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