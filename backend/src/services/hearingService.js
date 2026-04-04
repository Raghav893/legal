const { pool } = require("../config/db");
const { camelizeRow } = require("../utils/mapRows");

async function listHearings() {
  const [rows] = await pool.query(`
    SELECT h.id, h.case_id, h.hearing_date_time, h.courtroom, h.agenda, h.outcome, h.reminder_sent,
           c.title AS case_title
    FROM hearings h
    JOIN cases c ON c.id = h.case_id
    ORDER BY h.hearing_date_time ASC
  `);
  return rows.map(camelizeRow);
}

async function createHearing(payload) {
  const { caseId, hearingDateTime, courtroom, agenda, outcome, reminderSent } = payload;
  const [result] = await pool.query(
    `INSERT INTO hearings (case_id, hearing_date_time, courtroom, agenda, outcome, reminder_sent)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [caseId, hearingDateTime, courtroom, agenda, outcome || null, reminderSent ? 1 : 0]
  );
  const [[caseFile]] = await pool.query("SELECT title FROM cases WHERE id = ? LIMIT 1", [caseId]);
  return {
    id: result.insertId,
    caseId,
    hearingDateTime,
    courtroom,
    agenda,
    outcome: outcome || null,
    reminderSent: Boolean(reminderSent),
    caseTitle: caseFile ? caseFile.title : null
  };
}

module.exports = { listHearings, createHearing };
