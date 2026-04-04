"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const apiBase = "/api";

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "Active",
  ON_HOLD: "On Hold",
  CLOSED: "Closed"
};

const STATUS_COLORS: Record<string, "success" | "warning" | "muted" | "default" | "secondary"> = {
  OPEN: "success",
  IN_PROGRESS: "default",
  ON_HOLD: "warning",
  CLOSED: "muted"
};

type CaseEntry = {
  id: number;
  caseNumber: string;
  title: string;
  description?: string;
  status: string;
  courtName: string;
  judgeName: string;
  filingDate: string;
  nextHearingDate?: string;
  clientId: number;
  clientName?: string;
  advocateId?: number;
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
  const [deleting, setDeleting] = useState(false);
  
  // selectedId controls the slide-in panel
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Adding a new case? Controls a dedicated modal/panel (simplified here as form inline)
  const [isAdding, setIsAdding] = useState(false);
  
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    caseNumber: "",
    title: "",
    description: "",
    courtName: "",
    judgeName: "",
    status: "OPEN",
    filingDate: "",
    nextHearingDate: "",
    clientId: ""
  });

  const selectedCase = cases.find(c => c.id === selectedId);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.courtName.toLowerCase().includes(q) ||
        (c.clientName || "").toLowerCase().includes(q)
      );
    });
  }, [cases, query, statusFilter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.filingDate?.trim()) return;
    setSaving(true);
    try {
      const resp = await fetch(`${apiBase}/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          clientId: Number(form.clientId),
          nextHearingDate: form.nextHearingDate || undefined
        })
      });
      if (resp.ok) {
        const created = await resp.json();
        setCases([created, ...cases]);
        setIsAdding(false);
        setForm({
          caseNumber: "", title: "", description: "", courtName: "",
          judgeName: "", status: "OPEN", filingDate: "", nextHearingDate: "", clientId: ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id: number, newStatus: string) {
    setUpdatingStatus(id);
    try {
      const resp = await fetch(`${apiBase}/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.ok) {
        const updated = await resp.json();
        setCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this case? This action cannot be undone.")) return;
    
    setDeleting(true);
    try {
      const resp = await fetch(`${apiBase}/cases/${id}`, {
        method: "DELETE"
      });
      if (resp.ok) {
        setCases((prev) => prev.filter((c) => c.id !== id));
        setSelectedId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(isoStr?: string) {
    if (!isoStr) return "—";
    const date = new Date(isoStr);
    return isNaN(date.getTime()) ? isoStr : date.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  return (
    <div className="page-grid">
      {/* Search & Action bar */}
      <div className="toolbar-grid reveal">
        <div style={{ display: "flex", gap: "10px", flex: 1 }}>
          <Input
            placeholder="Search by case no, title, court, or client..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: "420px" }}
          />
          <select
            className="ui-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "160px" }}
          >
            <option value="ALL">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : "+ New Matter"}
        </Button>
      </div>

      {/* New Matter Form */}
      {isAdding && (
        <Card className="reveal" style={{ animationDelay: "0.05s" }}>
          <CardHeader>
            <h3 className="ui-card__title">Intake New Matter</h3>
            <p className="muted small">Open a new file and assign a client to track proceedings.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="form-grid">
              <div className="two-up">
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Case / File No.</label>
                  <Input required placeholder="SUIT-2024-001" value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Title</label>
                  <Input required placeholder="Smith vs Jones Corp" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
              </div>
              
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Internal Notes / Case Summary</label>
                <Textarea 
                  placeholder="Outline the core objective of the matter..." 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ minHeight: "80px", borderRadius: "10px", borderColor: "var(--border)" }}
                />
              </div>

              <div className="two-up">
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Client</label>
                  <select required className="ui-select" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                    <option value="" disabled>Select a client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Status</label>
                  <select required className="ui-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="OPEN">Open (Initiated)</option>
                    <option value="IN_PROGRESS">Active (In proceedings)</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="CLOSED">Closed (Resolved)</option>
                  </select>
                </div>
              </div>

              <div className="two-up">
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Court Name</label>
                  <Input required placeholder="High Court" value={form.courtName} onChange={(e) => setForm({ ...form, courtName: e.target.value })} />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Judge Name</label>
                  <Input required placeholder="Hon. Justice Brown" value={form.judgeName} onChange={(e) => setForm({ ...form, judgeName: e.target.value })} />
                </div>
              </div>

              <div className="two-up">
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Filing Date</label>
                  <DatePicker
                    id="case-filing-date"
                    value={form.filingDate}
                    onChange={(filingDate) => setForm({ ...form, filingDate })}
                    placeholder="Select filing date"
                  />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>Next Hearing</label>
                  <DatePicker
                    id="case-next-hearing"
                    value={form.nextHearingDate}
                    onChange={(nextHearingDate) => setForm({ ...form, nextHearingDate })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <Button type="submit" disabled={saving}>
                  {saving ? "Opening Matter..." : "Open Matter"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Main List */}
      <Card className="reveal" style={{ animationDelay: "0.1s" }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case No.</th>
                <th>Title</th>
                <th>Status</th>
                <th>Client</th>
                <th>Filing Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>
                    No matters matching criteria.
                  </td>
                </tr>
              )}
              {filtered.map((entry) => (
                <tr
                  key={entry.id}
                  className={entry.id === selectedId ? "row-selected" : "row-clickable"}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <td style={{ fontFamily: "monospace", fontSize: "0.85em", fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {entry.caseNumber}
                  </td>
                  <td style={{ fontWeight: 500 }}>{entry.title}</td>
                  <td>
                    <Badge variant={STATUS_COLORS[entry.status] || "default"}>
                      {STATUS_LABELS[entry.status] || entry.status}
                    </Badge>
                  </td>
                  <td><span className="muted">{entry.clientName || "—"}</span></td>
                  <td style={{ fontSize: "0.85em", opacity: 0.8 }}>{formatDate(entry.filingDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-in Detail Panel */}
      {selectedCase && (
        <>
          <div className="case-panel-overlay" onClick={() => setSelectedId(null)} />
          <div className="case-panel">
            <div className="case-panel__header">
              <div>
                <p className="eyebrow" style={{ margin: "0 0 6px" }}>Matter Overview</p>
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                  {selectedCase.title}
                </h3>
                <p style={{ marginTop: 6, fontSize: 13, fontFamily: "monospace", opacity: 0.7 }}>
                  {selectedCase.caseNumber}
                </p>
              </div>
              <button className="case-panel__close" onClick={() => setSelectedId(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="case-panel__body">
              {/* Description */}
              <div className="case-panel__section">
                <span className="case-panel__section-title">Case Notes</span>
                <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.6 }}>
                  {selectedCase.description || "No internal notes provided for this matter."}
                </p>
              </div>

              {/* Grid 1: People & Place */}
              <div className="meta-grid">
                <div className="meta-item">
                  <div className="meta-item__label">Client</div>
                  <div className="meta-item__value">{selectedCase.clientName || "—"}</div>
                </div>
                <div className="meta-item">
                  <div className="meta-item__label">Court</div>
                  <div className="meta-item__value">{selectedCase.courtName}</div>
                </div>
                <div className="meta-item text-center" style={{ gridColumn: "1 / -1" }}>
                  <div className="meta-item__label">Presiding Judge</div>
                  <div className="meta-item__value">{selectedCase.judgeName}</div>
                </div>
              </div>

              {/* Grid 2: Timeline */}
              <div className="case-panel__section" style={{ marginTop: 8 }}>
                <span className="case-panel__section-title">Timeline</span>
                <div className="meta-grid">
                  <div className="meta-item">
                    <div className="meta-item__label">Filing Date</div>
                    <div className="meta-item__value">{formatDate(selectedCase.filingDate)}</div>
                  </div>
                  <div className="meta-item" style={{ background: "rgba(184,146,74,0.06)", borderColor: "rgba(184,146,74,0.2)" }}>
                    <div className="meta-item__label" style={{ color: "var(--gold)" }}>Next Hearing</div>
                    <div className="meta-item__value" style={{ color: "var(--ink)" }}>{formatDate(selectedCase.nextHearingDate)}</div>
                  </div>
                </div>
              </div>

              {/* Status Update section */}
              <div className="case-panel__section" style={{ marginTop: 8 }}>
                 <span className="case-panel__section-title">Update Status</span>
                 <div className="status-pill-row" style={{ marginTop: 8 }}>
                   {Object.entries(STATUS_LABELS).map(([value, label]) => {
                     const isActive = selectedCase.status === value;
                     const solidColor =
                       value === "OPEN" ? "#16a34a" :
                       value === "IN_PROGRESS" ? "#4f46e5" :
                       value === "ON_HOLD" ? "#d97706" :
                       "#374151";
                     return (
                       <button
                         key={value}
                         disabled={isActive || updatingStatus === selectedId}
                         onClick={() => handleStatusChange(selectedCase.id, value)}
                         style={{
                           padding: "0.4rem 1rem",
                           borderRadius: "999px",
                           border: `2px solid ${solidColor}`,
                           fontSize: "0.78rem",
                           fontWeight: 700,
                           letterSpacing: "0.02em",
                           cursor: isActive ? "default" : "pointer",
                           transition: "all 0.15s ease",
                           background: isActive ? solidColor : "transparent",
                           color: isActive ? "#ffffff" : solidColor,
                           boxShadow: isActive ? `0 0 0 3px ${solidColor}33` : "none",
                           transform: isActive ? "scale(1)" : "scale(0.97)"
                         }}
                       >
                         {updatingStatus === selectedId ? "•••" : label}
                       </button>
                     );
                   })}
                 </div>
              </div>
            </div>

            <div className="case-panel__footer" style={{ justifyContent: "flex-end", background: "#fff" }}>
               <Button 
                 variant="ghost" 
                 style={{ color: "var(--danger)", border: "1px solid rgba(153, 27, 27, 0.15)", background: "var(--danger-bg)" }}
                 onClick={() => handleDelete(selectedCase.id)}
                 disabled={deleting}
               >
                 {deleting ? "Deleting..." : "Delete Case"}
               </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
