import { MetricCard } from "@/components/MetricCard";
import { readDb } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const db = await readDb();
  const data = {
    totalClients: db.clients.length,
    activeCases: db.cases.filter((item) => item.status !== "CLOSED").length,
    closedCases: db.cases.filter((item) => item.status === "CLOSED").length,
    upcomingHearingsCount: db.hearings.length,
    upcomingHearings: db.hearings.map((hearing) => {
      const caseFile = db.cases.find((item) => item.id === hearing.caseId);
      return {
        id: hearing.id,
        caseNumber: caseFile?.caseNumber || "-",
        caseTitle: caseFile?.title || "-",
        hearingDateTime: hearing.hearingDateTime,
        courtroom: hearing.courtroom
      };
    })
  };

  return (
    <div className="page-grid">
      <Card>
        <CardHeader>
          <p className="eyebrow">Firm overview</p>
          <CardTitle>Today’s legal operations picture</CardTitle>
          <CardDescription>
            A concise snapshot of active work, hearing readiness, and matter movement across the firm.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="stats-grid">
        <MetricCard title="Clients" value={data.totalClients} note="Current client relationships" />
        <MetricCard title="Active Matters" value={data.activeCases} note="Open and in-progress cases" />
        <MetricCard title="Closed Matters" value={data.closedCases} note="Resolved or archived work" />
        <MetricCard title="Upcoming Hearings" value={data.upcomingHearingsCount} note="Hearings requiring preparation" />
      </section>

      <Card>
        <CardHeader className="split">
          <div>
            <CardTitle>Upcoming hearings</CardTitle>
            <CardDescription>Next appearances that need coordination and advocate preparation.</CardDescription>
          </div>
          <Badge variant="muted">{data.upcomingHearingsCount} scheduled</Badge>
        </CardHeader>
        <CardContent className="table-wrap">
          <table className="data-table">
          <thead>
            <tr>
              <th>Case Number</th>
              <th>Case Title</th>
              <th>Date & Time</th>
              <th>Courtroom</th>
            </tr>
          </thead>
          <tbody>
            {data.upcomingHearings.map((hearing) => (
              <tr key={hearing.id}>
                <td>{hearing.caseNumber}</td>
                <td>{hearing.caseTitle}</td>
                <td>{new Date(hearing.hearingDateTime).toLocaleString()}</td>
                <td>{hearing.courtroom}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
