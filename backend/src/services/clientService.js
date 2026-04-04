const { pool } = require("../config/db");
const { camelizeRow } = require("../utils/mapRows");

async function listClients() {
  const [rows] = await pool.query(
    "SELECT id, full_name, email, phone, address, company_name, notes FROM clients ORDER BY id DESC"
  );
  return rows.map(camelizeRow);
}

async function createClient(payload) {
  const { fullName, email, phone, address, companyName, notes } = payload;
  const [result] = await pool.query(
    "INSERT INTO clients (full_name, email, phone, address, company_name, notes) VALUES (?, ?, ?, ?, ?, ?)",
    [fullName, email || null, phone, address, companyName || null, notes || null]
  );
  return {
    id: result.insertId,
    fullName,
    email: email || null,
    phone,
    address,
    companyName: companyName || null,
    notes: notes || null
  };
}

module.exports = { listClients, createClient };
