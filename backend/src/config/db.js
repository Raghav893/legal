const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "legal_user",
  password: process.env.DB_PASSWORD || "legal_password",
  database: process.env.DB_NAME || "legal_case_db",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = { pool };
