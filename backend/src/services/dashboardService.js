const { pool } = require("../config/db");

async function getSummary() {
  const [[{ totalClients }]] = await pool.query("SELECT COUNT(*) AS totalClients FROM clients");
  const [[{ activeCases }]] = await pool.query("SELECT COUNT(*) AS activeCases FROM cases WHERE status <> 'CLOSED'");
  const [[{ closedCases }]] = await pool.query("SELECT COUNT(*) AS closedCases FROM cases WHERE status = 'CLOSED'");
  const [hearings] = await pool.query(`
    SELECT h.id, h.hearing_date_time, h.courtroom, c.case_number, c.title AS case_title
    FROM hearings h
    JOIN cases c ON c.id = h.case_id
    ORDER BY h.hearing_date_time ASC
    LIMIT 10
  `);

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
