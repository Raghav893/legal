import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET() {
  const db = await readDb();
  const activeCases = db.cases.filter((item) => item.status !== "CLOSED").length;
  const closedCases = db.cases.filter((item) => item.status === "CLOSED").length;
  const upcomingHearings = db.hearings
    .sort((a, b) => a.hearingDateTime.localeCompare(b.hearingDateTime))
    .map((hearing) => {
      const caseFile = db.cases.find((entry) => entry.id === hearing.caseId);
      return {
        id: hearing.id,
        caseNumber: caseFile?.caseNumber,
        caseTitle: caseFile?.title,
        hearingDateTime: hearing.hearingDateTime,
        courtroom: hearing.courtroom,
        agenda: hearing.agenda
      };
    });

  return NextResponse.json({
    totalClients: db.clients.length,
    activeCases,
    closedCases,
    upcomingHearingsCount: upcomingHearings.length,
    upcomingHearings
  });
}
