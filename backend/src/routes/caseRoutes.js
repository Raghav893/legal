const express = require("express");
const { createCase, listCases, updateCase, deleteCase } = require("../services/caseService");

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

router.patch("/:id", async (req, res, next) => {
  try {
    const updated = await updateCase(Number(req.params.id), req.body, req.user.id);
    if (!updated) return res.status(404).json({ message: "Case not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteCase(Number(req.params.id), req.user.id);
    if (!deleted) return res.status(404).json({ message: "Case not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
