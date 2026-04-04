import { readDb } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HearingsPage() {
  const db = await readDb();
  const hearings = db.hearings.map((hearing) => ({
    id: hearing.id,
    caseTitle: db.cases.find((entry) => entry.id === hearing.caseId)?.title || "-",
    at: hearing.hearingDateTime.replace("T", " ").slice(0, 16),
    courtroom: hearing.courtroom,
    agenda: hearing.agenda
  }));
  return (
    <Card>
      <CardHeader className="split">
        <div>
          <p className="eyebrow">Scheduling</p>
          <CardTitle>Hearings</CardTitle>
          <CardDescription>Operational visibility into the next appearances, rooms, and agenda items.</CardDescription>
        </div>
        <Badge variant="muted">{hearings.length} upcoming</Badge>
      </CardHeader>
      <CardContent className="stats-grid">
        {hearings.map((hearing) => (
          <Card key={hearing.id}>
            <CardHeader>
              <CardTitle>{hearing.caseTitle}</CardTitle>
              <CardDescription>{hearing.at}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="warning">{hearing.courtroom}</Badge>
              <p className="muted small" style={{ marginTop: 12 }}>{hearing.agenda}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
