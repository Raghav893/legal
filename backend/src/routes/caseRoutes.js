const express = require("express");
const { createCase, listCases } = require("../services/caseService");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await listCases());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await createCase(req.body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
