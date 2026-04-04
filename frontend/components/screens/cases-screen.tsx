"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

type CaseEntry = {
  id: number;
  caseNumber: string;
  title: string;
  status: string;
  courtName: string;
  judgeName: string;
  filingDate: string;
  clientId: number;
  clientName?: string;
};

type ClientOption = { id: number; fullName: string };

export function CasesScreen({
  initialCases,
  clients
}: {
  initialCases: CaseEntry[];
  clients: ClientOption[];
}) {
  const [cases, setCases] = useState(initialCases);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    caseNumber: "",
    title: "",
    description: "",
    courtName: "",
    judgeName: "",
    status: "OPEN",
    filingDate: new Date().toISOString().slice(0, 10),
    nextHearingDate: "",
    clientId: clients[0]?.id ?? 1,
    advocateId: 1
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(`${apiBase}/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const created = await response.json();
    setCases((current) => [
      {
        ...created,
        clientName: clients.find((client) => client.id === Number(created.clientId))?.fullName || "-"
      },
      ...current
    ]);
    setSaving(false);
  }

  return (
    <div className="page-grid">
      <Card className="reveal">
        <CardHeader className="split">
          <div>
            <p className="eyebrow">Matter pipeline</p>
            <CardTitle>Cases</CardTitle>
            <CardDescription>Open new matters, assign clients, and track status with discipline.</CardDescription>
          </div>
          <Badge>{cases.length} matters</Badge>
        </CardHeader>
      </Card>

      <div className="panel-grid">
        <Card className="reveal">
          <CardHeader>
            <CardTitle>Add matter</CardTitle>
            <CardDescription>Create a new case file and assign it to an existing client record.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="form-grid" onSubmit={handleSubmit}>
              <Input placeholder="Case number" value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} required />
              <Input placeholder="Matter title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Court name" value={form.courtName} onChange={(e) => setForm({ ...form, courtName: e.target.value })} required />
              <Input placeholder="Judge name" value={form.judgeName} onChange={(e) => setForm({ ...form, judgeName: e.target.value })} required />
              <div className="form-grid two-up">
                <input className="ui-input" type="date" value={form.filingDate} onChange={(e) => setForm({ ...form, filingDate: e.target.value })} required />
                <select className="ui-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>OPEN</option>
                  <option>IN_PROGRESS</option>
                  <option>ON_HOLD</option>
                  <option>CLOSED</option>
                </select>
              </div>
              <select className="ui-select" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: Number(e.target.value) })}>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.fullName}</option>
                ))}
              </select>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create Matter"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="reveal">
          <CardHeader>
            <CardTitle>Matter tracker</CardTitle>
            <CardDescription>High-level court, judge, and status visibility for active legal work.</CardDescription>
          </CardHeader>
          <CardContent className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case Number</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Court</th>
                  <th>Client</th>
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
                    <td>{entry.courtName}</td>
                    <td>{entry.clientName || "-"}</td>
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
