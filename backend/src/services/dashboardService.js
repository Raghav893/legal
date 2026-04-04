const { pool } = require("../config/db");

async function getSummary(ownerUserId) {
  const [[{ totalClients }]] = await pool.query("SELECT COUNT(*) AS totalClients FROM clients WHERE owner_user_id = ?", [ownerUserId]);
  const [[{ activeCases }]] = await pool.query("SELECT COUNT(*) AS activeCases FROM cases WHERE owner_user_id = ? AND status <> 'CLOSED'", [ownerUserId]);
  const [[{ closedCases }]] = await pool.query("SELECT COUNT(*) AS closedCases FROM cases WHERE owner_user_id = ? AND status = 'CLOSED'", [ownerUserId]);
  const [hearings] = await pool.query(`
    SELECT h.id, h.hearing_date_time, h.courtroom, c.case_number, c.title AS case_title
    FROM hearings h
    JOIN cases c ON c.id = h.case_id
    WHERE h.owner_user_id = ?
    ORDER BY h.hearing_date_time ASC
    LIMIT 10
  `, [ownerUserId]);

  return {
    totalClients,
    activeCases,
    closedCases,
    upcomingHearingsCount: hearings.length,
    upcomingHearings: hearings.map((hearing) => ({
      id: hearing.id,
      caseNumber: hearing.case_number,
      caseTitle: hearing.case_title,
      hearingDateTime: hearing.hearing_date_time,
      courtroom: hearing.courtroom
    }))
  };
}

module.exports = { getSummary };
