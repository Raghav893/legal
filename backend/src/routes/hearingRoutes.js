const express = require("express");
const { createHearing, listHearings } = require("../services/hearingService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await listHearings(req.user.id));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await createHearing(req.body, req.user.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
