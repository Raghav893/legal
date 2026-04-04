const express = require("express");
const { getSummary } = require("../services/dashboardService");

const router = express.Router();

router.get("/summary", async (_req, res, next) => {
  try {
    res.json(await getSummary());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
