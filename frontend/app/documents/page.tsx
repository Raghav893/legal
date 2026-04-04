import { readDb } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DocumentsPage() {
  const db = await readDb();
  const documents = db.documents.map((doc) => ({
    id: doc.id,
    name: doc.fileName,
    type: doc.documentType,
    matter: db.cases.find((entry) => entry.id === doc.caseId)?.title || "-",
    uploadedBy: db.users.find((entry) => entry.id === doc.uploadedById)?.fullName || "-"
  }));
  return (
    <Card>
      <CardHeader className="split">
        <div>
          <p className="eyebrow">Document workspace</p>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Centralized case-linked records for filings, evidence, and internal drafting support.</CardDescription>
        </div>
        <Badge variant="muted">{documents.length} files</Badge>
      </CardHeader>
      <CardContent className="table-wrap">
        <table className="data-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Type</th>
            <th>Case</th>
            <th>Uploaded By</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td><Badge variant="default">{doc.type}</Badge></td>
              <td>{doc.matter}</td>
              <td>{doc.uploadedBy}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
