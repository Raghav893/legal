import { readDb } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CasesPage() {
  const db = await readDb();
  const cases = db.cases.map((entry) => ({
    id: entry.id,
    caseNumber: entry.caseNumber,
    title: entry.title,
    status: entry.status,
    court: entry.courtName,
    judge: entry.judgeName
  }));
  return (
    <Card>
      <CardHeader className="split">
        <div>
          <p className="eyebrow">Matter pipeline</p>
          <CardTitle>Cases</CardTitle>
          <CardDescription>Track court assignment, judge details, filing dates, and live matter status.</CardDescription>
        </div>
        <Badge>{cases.length} matters</Badge>
      </CardHeader>
      <CardContent className="table-wrap">
        <table className="data-table">
        <thead>
          <tr>
            <th>Case Number</th>
            <th>Title</th>
            <th>Status</th>
            <th>Court</th>
            <th>Judge</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.caseNumber}</td>
              <td>{entry.title}</td>
              <td>
                <Badge variant={entry.status === "CLOSED" ? "muted" : entry.status === "OPEN" ? "success" : "warning"}>
                  {entry.status}
                </Badge>
              </td>
              <td>{entry.court}</td>
              <td>{entry.judge}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
