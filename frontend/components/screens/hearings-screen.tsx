"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

type HearingEntry = {
  id: number;
  caseId: number;
  caseTitle?: string;
  hearingDateTime: string;
  courtroom: string;
  agenda: string;
};

type CaseOption = { id: number; title: string };

export function HearingsScreen({
  initialHearings,
  cases
}: {
  initialHearings: HearingEntry[];
  cases: CaseOption[];
}) {
  const [hearings, setHearings] = useState(initialHearings);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    caseId: cases[0]?.id ?? 1,
    hearingDateTime: "",
    courtroom: "",
    agenda: "",
    outcome: "",
    reminderSent: false
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(`${apiBase}/hearings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const created = await response.json();
    setHearings((current) => [
      {
        ...created,
        caseTitle: cases.find((entry) => entry.id === Number(created.caseId))?.title || "-"
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
            <p className="eyebrow">Scheduling</p>
            <CardTitle>Hearings</CardTitle>
            <CardDescription>Plan courtroom activity and maintain clear visibility into upcoming appearances.</CardDescription>
          </div>
          <Badge variant="muted">{hearings.length} scheduled</Badge>
        </CardHeader>
      </Card>

      <div className="panel-grid">
        <Card className="reveal">
          <CardHeader>
            <CardTitle>Schedule hearing</CardTitle>
            <CardDescription>Add a hearing with matter context, courtroom allocation, and agenda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="form-grid" onSubmit={handleSubmit}>
              <select className="ui-select" value={form.caseId} onChange={(e) => setForm({ ...form, caseId: Number(e.target.value) })}>
                {cases.map((entry) => (
                  <option key={entry.id} value={entry.id}>{entry.title}</option>
                ))}
              </select>
              <input className="ui-input" type="datetime-local" value={form.hearingDateTime} onChange={(e) => setForm({ ...form, hearingDateTime: e.target.value })} required />
              <Input placeholder="Courtroom" value={form.courtroom} onChange={(e) => setForm({ ...form, courtroom: e.target.value })} required />
              <Input placeholder="Agenda" value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} required />
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Hearing"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="reveal">
          <CardHeader>
            <CardTitle>Upcoming calendar</CardTitle>
            <CardDescription>Operational hearing list for preparation, attendance, and reminders.</CardDescription>
          </CardHeader>
          <CardContent className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matter</th>
                  <th>Date & Time</th>
                  <th>Courtroom</th>
                  <th>Agenda</th>
                </tr>
              </thead>
              <tbody>
                {hearings.map((hearing) => (
                  <tr key={hearing.id}>
                    <td>{hearing.caseTitle || "-"}</td>
                    <td>{hearing.hearingDateTime.replace("T", " ").slice(0, 16)}</td>
                    <td><Badge variant="warning">{hearing.courtroom}</Badge></td>
                    <td>{hearing.agenda}</td>
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
