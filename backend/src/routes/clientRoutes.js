const express = require("express");
const { createClient, listClients } = require("../services/clientService");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await listClients(req.user.id));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await createClient(req.body, req.user.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
