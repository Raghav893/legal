const express = require("express");
const { createDocument, listDocuments } = require("../services/documentService");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await listDocuments());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await createDocument(req.body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
