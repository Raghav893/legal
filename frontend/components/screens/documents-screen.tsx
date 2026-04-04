"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const apiBase = "/api";

type DocumentEntry = {
  id: number;
  fileName: string;
  documentType: string;
  contentType?: string;
  sizeBytes?: number;
  documentUrl?: string;
  summary?: string;
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
  const [selectedId, setSelectedId] = useState(initialDocuments[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    fileName: "",
    documentType: "CASE_FILE",
    summary: "",
    caseId: cases[0]?.id ?? 1,
    uploadedById: 1
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesQuery =
        doc.fileName.toLowerCase().includes(query.toLowerCase()) ||
        (doc.caseTitle || "").toLowerCase().includes(query.toLowerCase()) ||
        (doc.summary || "").toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === "ALL" || doc.documentType === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [documents, query, typeFilter]);

  const selectedDocument =
    filteredDocuments.find((doc) => doc.id === selectedId) ||
    documents.find((doc) => doc.id === selectedId) ||
    filteredDocuments[0] ||
    null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setSaving(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", form.documentType);
    formData.append("summary", form.summary);
    formData.append("caseId", String(form.caseId));
    formData.append("uploadedById", String(form.uploadedById));

    const response = await fetch(`${apiBase}/documents`, {
      method: "POST",
      body: formData
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
    setSelectedId(created.id);
    setForm({ ...form, fileName: "", summary: "" });
    setFile(null);
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
            <CardDescription>Attach a document record, source URL, and notes so the team can preview it directly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="form-grid" onSubmit={handleSubmit}>
              <Input 
                type="file" 
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                }} 
                required 
              />
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
              <Textarea placeholder="Summary / internal note" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Document"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="reveal">
          <CardHeader className="space-y-4">
            <div className="split">
              <div>
                <CardTitle>Document registry</CardTitle>
                <CardDescription>Search, filter, and open files directly inside the workspace.</CardDescription>
              </div>
              <Badge variant="muted">{filteredDocuments.length} visible</Badge>
            </div>
            <div className="toolbar-grid">
              <Input placeholder="Search documents, matters, or notes" value={query} onChange={(e) => setQuery(e.target.value)} />
              <select className="ui-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="ALL">All types</option>
                <option value="CASE_FILE">Case file</option>
                <option value="AGREEMENT">Agreement</option>
                <option value="EVIDENCE">Evidence</option>
                <option value="COURT_ORDER">Court order</option>
                <option value="INVOICE">Invoice</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="preview-grid">
            <div className="table-wrap">
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
                  {filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className={doc.id === selectedDocument?.id ? "row-selected" : "row-clickable"}
                      onClick={() => setSelectedId(doc.id)}
                    >
                      <td>{doc.fileName}</td>
                      <td><Badge>{doc.documentType}</Badge></td>
                      <td>{doc.caseTitle || "-"}</td>
                      <td>{doc.uploadedByName || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="document-preview">
              {selectedDocument ? (
                <Card className="h-full">
                  <CardHeader>
                    <div className="split">
                      <div>
                        <CardTitle>{selectedDocument.fileName}</CardTitle>
                        <CardDescription>{selectedDocument.caseTitle || "Unassigned matter"}</CardDescription>
                      </div>
                      <Badge variant="secondary">{selectedDocument.documentType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="preview-meta">
                      <span>{selectedDocument.uploadedByName || "-"}</span>
                      <span>{selectedDocument.contentType || "application/pdf"}</span>
                      <span>{selectedDocument.sizeBytes ? `${Math.round(selectedDocument.sizeBytes / 1024)} KB` : "-"}</span>
                    </div>
                    <p className="muted small">{selectedDocument.summary || "No internal summary added yet."}</p>
                    {selectedDocument.documentUrl ? (
                      selectedDocument.contentType?.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="preview-frame" src={`http://localhost:4000${selectedDocument.documentUrl}`} alt={selectedDocument.fileName} />
                      ) : (
                        <iframe className="preview-frame" src={`http://localhost:4000${selectedDocument.documentUrl}`} title={selectedDocument.fileName} />
                      )
                    ) : (
                      <div className="preview-empty">
                        <p className="muted">No preview URL was added for this document.</p>
                      </div>
                    )}
                    {selectedDocument.documentUrl ? (
                      <a href={`http://localhost:4000${selectedDocument.documentUrl}`} target="_blank" rel="noreferrer">
                        <Button variant="secondary">Open source document</Button>
                      </a>
                    ) : null}
                  </CardContent>
                </Card>
              ) : (
                <div className="preview-empty">
                  <p className="muted">Select a document to inspect it.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
