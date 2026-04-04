const express = require("express");
const { getSummary } = require("../services/dashboardService");

const router = express.Router();

router.get("/summary", async (req, res, next) => {
  try {
    res.json(await getSummary(req.user.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
