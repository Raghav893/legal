const express = require("express");
const { createCase, listCases } = require("../services/caseService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await listCases(req.user.id));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await createCase(req.body, req.user.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
