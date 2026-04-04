import { readDb } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ClientsPage() {
  const db = await readDb();
  const clients = db.clients;
  return (
    <Card>
      <CardHeader className="split">
        <div>
          <p className="eyebrow">Relationship management</p>
          <CardTitle>Clients</CardTitle>
          <CardDescription>High-signal profiles for every individual and corporate client the firm serves.</CardDescription>
        </div>
        <Badge variant="muted">{clients.length} total</Badge>
      </CardHeader>
      <CardContent className="table-wrap">
        <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.fullName}</td>
              <td>{client.phone}</td>
              <td>{client.email}</td>
              <td>{client.companyName}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
