const { pool } = require("../config/db");
const { camelizeRow } = require("../utils/mapRows");

async function listCases(ownerUserId) {
  const [rows] = await pool.query(`
    SELECT c.id, c.case_number, c.title, c.description, c.court_name, c.judge_name, c.status,
           c.filing_date, c.next_hearing_date, c.client_id, cl.full_name AS client_name,
           c.advocate_id
    FROM cases c
    JOIN clients cl ON cl.id = c.client_id
    WHERE c.owner_user_id = ?
    ORDER BY c.id DESC
  `, [ownerUserId]);
  return rows.map(camelizeRow);
}

async function createCase(payload, ownerUserId) {
  const {
    caseNumber,
    title,
    description,
    courtName,
    judgeName,
    status,
    filingDate,
    nextHearingDate,
    clientId,
    advocateId
  } = payload;

  const [result] = await pool.query(
    `INSERT INTO cases
      (owner_user_id, case_number, title, description, court_name, judge_name, status, filing_date, next_hearing_date, client_id, advocate_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ownerUserId,
      caseNumber,
      title,
      description || null,
      courtName,
      judgeName,
      status,
      filingDate,
      nextHearingDate || null,
      clientId,
      advocateId || null
    ]
  );

  const [[client]] = await pool.query("SELECT full_name FROM clients WHERE id = ? LIMIT 1", [clientId]);
  return {
    id: result.insertId,
    caseNumber,
    title,
    description: description || null,
    courtName,
    judgeName,
    status,
    filingDate,
    nextHearingDate: nextHearingDate || null,
    clientId,
    clientName: client ? client.full_name : null,
    advocateId: advocateId || null
  };
}

module.exports = { listCases, createCase };
