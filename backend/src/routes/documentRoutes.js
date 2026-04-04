const express = require("express");
const multer = require("multer");
const path = require("path");
const { createDocument, listDocuments } = require("../services/documentService");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await listDocuments(req.user.id));
  } catch (error) {
    next(error);
  }
});

router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      file: req.file
    };
    res.status(201).json(await createDocument(payload, req.user.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
