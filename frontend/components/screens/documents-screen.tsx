"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

type DocumentEntry = {
  id: number;
  fileName: string;
  documentType: string;
  caseId: number;
  caseTitle?: string;
  uploadedByName?: string;
};

type CaseOption = { id: number; title: string };

export function DocumentsScreen({
  initialDocuments,
  cases
}: {
  initialDocuments: DocumentEntry[];
  cases: CaseOption[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fileName: "",
    documentType: "CASE_FILE",
    contentType: "application/pdf",
    sizeBytes: 102400,
    caseId: cases[0]?.id ?? 1,
    uploadedById: 1
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(`${apiBase}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const created = await response.json();
    setDocuments((current) => [
      {
        ...created,
        caseTitle: cases.find((entry) => entry.id === Number(created.caseId))?.title || "-",
        uploadedByName: "System Administrator"
      },
      ...current
    ]);
    setForm({ ...form, fileName: "" });
    setSaving(false);
  }

  return (
    <div className="page-grid">
      <Card className="reveal">
        <CardHeader className="split">
          <div>
            <p className="eyebrow">Document workspace</p>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Register filing packets, evidence bundles, and internal drafting artifacts.</CardDescription>
          </div>
          <Badge variant="muted">{documents.length} files</Badge>
        </CardHeader>
      </Card>

      <div className="panel-grid">
        <Card className="reveal">
          <CardHeader>
            <CardTitle>Add document</CardTitle>
            <CardDescription>Attach a document record to the relevant matter for team visibility.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="form-grid" onSubmit={handleSubmit}>
              <Input placeholder="File name" value={form.fileName} onChange={(e) => setForm({ ...form, fileName: e.target.value })} required />
              <select className="ui-select" value={form.caseId} onChange={(e) => setForm({ ...form, caseId: Number(e.target.value) })}>
                {cases.map((entry) => (
                  <option key={entry.id} value={entry.id}>{entry.title}</option>
                ))}
              </select>
              <select className="ui-select" value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value })}>
                <option>CASE_FILE</option>
                <option>AGREEMENT</option>
                <option>EVIDENCE</option>
                <option>COURT_ORDER</option>
                <option>INVOICE</option>
                <option>OTHER</option>
              </select>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Document"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="reveal">
          <CardHeader>
            <CardTitle>Document registry</CardTitle>
            <CardDescription>Minimal document ledger for filings, evidence, and supporting material.</CardDescription>
          </CardHeader>
          <CardContent className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Matter</th>
                  <th>Uploaded By</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.fileName}</td>
                    <td><Badge>{doc.documentType}</Badge></td>
                    <td>{doc.caseTitle || "-"}</td>
                    <td>{doc.uploadedByName || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
