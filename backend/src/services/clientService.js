const { pool } = require("../config/db");
const { camelizeRow } = require("../utils/mapRows");

async function listClients(ownerUserId) {
  const [rows] = await pool.query(
    "SELECT id, full_name, email, phone, address, company_name, notes FROM clients WHERE owner_user_id = ? ORDER BY id DESC",
    [ownerUserId]
  );
  return rows.map(camelizeRow);
}

async function createClient(payload, ownerUserId) {
  const { fullName, email, phone, address, companyName, notes } = payload;
  const [result] = await pool.query(
    "INSERT INTO clients (owner_user_id, full_name, email, phone, address, company_name, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [ownerUserId, fullName, email || null, phone, address, companyName || null, notes || null]
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
