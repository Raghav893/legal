const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { httpError } = require("../utils/httpError");
const { camelizeRow } = require("../utils/mapRows");

function signUser(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, fullName: user.fullName },
    process.env.JWT_SECRET || "replace-this-in-production",
    { expiresIn: "1d" }
  );
}

async function login({ email, password }) {
  const [rows] = await pool.query(
    "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  const user = rows[0];
  if (!user) throw httpError(401, "Invalid credentials");

  const matches = user.password_hash === password || await bcrypt.compare(password, user.password_hash);
  if (!matches) throw httpError(401, "Invalid credentials");

  const normalized = camelizeRow(user);
  return {
    token: signUser(normalized),
    id: normalized.id,
    fullName: normalized.fullName,
    email: normalized.email,
    role: normalized.role
  };
}

async function register({ fullName, email, password, role }) {
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (existing.length) throw httpError(409, "Email already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [fullName, email, passwordHash, role || "ASSISTANT"]
  );

  return {
    token: signUser({ id: result.insertId, fullName, email, role: role || "ASSISTANT" }),
    id: result.insertId,
    fullName,
    email,
    role: role || "ASSISTANT"
  };
}

module.exports = { login, register };
