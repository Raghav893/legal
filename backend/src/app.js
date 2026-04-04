require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const caseRoutes = require("./routes/caseRoutes");
const hearingRoutes = require("./routes/hearingRoutes");
const documentRoutes = require("./routes/documentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const { authMiddleware } = require("./middleware/authMiddleware");

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/clients", authMiddleware, clientRoutes);
app.use("/api/cases", authMiddleware, caseRoutes);
app.use("/api/hearings", authMiddleware, hearingRoutes);
app.use("/api/documents", authMiddleware, documentRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use(errorHandler);

module.exports = app;
