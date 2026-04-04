const express = require("express");
const { createHearing, listHearings } = require("../services/hearingService");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await listHearings());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await createHearing(req.body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
