"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const apiBase = "/api";

type Client = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  notes?: string;
};

export function ClientsScreen({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    companyName: "",
    notes: ""
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(`${apiBase}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const created = await response.json();
    setClients((current) => [created, ...current]);
    setForm({ fullName: "", email: "", phone: "", address: "", companyName: "", notes: "" });
    setSaving(false);
  }

  return (
    <div className="page-grid">
      <Card className="reveal">
        <CardHeader className="split">
          <div>
            <p className="eyebrow">Relationship management</p>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Maintain clean client profiles with contact and firm context in one place.</CardDescription>
          </div>
          <Badge variant="muted">{clients.length} total</Badge>
        </CardHeader>
      </Card>

      <div className="panel-grid">
        <Card className="reveal">
          <CardHeader>
            <CardTitle>Add client</CardTitle>
            <CardDescription>Create a new client record for intake and matter assignment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="form-grid" onSubmit={handleSubmit}>
              <Input placeholder="Client full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              <Input placeholder="Client email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              <Input placeholder="Company / organization" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              <Input placeholder="Internal notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create Client"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="reveal">
          <CardHeader>
            <CardTitle>Client registry</CardTitle>
            <CardDescription>Operational view of all active relationships in the firm.</CardDescription>
          </CardHeader>
          <CardContent className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Company</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.fullName}</td>
                    <td>{client.phone}</td>
                    <td>{client.email || "-"}</td>
                    <td>{client.companyName || "Individual"}</td>
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
