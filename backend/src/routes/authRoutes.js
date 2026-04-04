const express = require("express");
const { login, register } = require("../services/authService");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    res.json(await login(req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    res.status(201).json(await register(req.body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
