"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardData = {
  totalClients: number;
  activeCases: number;
  closedCases: number;
  upcomingHearingsCount: number;
  upcomingHearings: Array<{
    id: number;
    caseNumber: string;
    caseTitle: string;
    hearingDateTime: string;
    courtroom: string;
  }>;
};

export function DashboardScreen({ data }: { data: DashboardData }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function onScroll() {
      setOffset(window.scrollY);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Client portfolio", value: data.totalClients, note: "Relationships under active management" },
      { label: "Open matters", value: data.activeCases, note: "Cases currently moving through the firm" },
      { label: "Closed matters", value: data.closedCases, note: "Resolved and archived work" },
      { label: "Upcoming hearings", value: data.upcomingHearingsCount, note: "Appearances requiring preparation" }
    ],
    [data]
  );

  return (
    <div className="page-grid">
      <section className="apple-hero reveal">
        <div
          className="apple-hero__copy"
          style={{ transform: `translate3d(0, ${offset * 0.05}px, 0)` }}
        >
          <p className="eyebrow">Legal operating system</p>
          <h1 className="apple-hero__title">
            A calmer, sharper way to run
            <br />
            a modern law firm.
          </h1>
          <p className="apple-hero__description">
            Centralize client relationships, hearings, matters, and documents in a workspace built for high-trust professional teams.
          </p>
        </div>

        <div
          className="apple-hero__panel"
          style={{ transform: `translate3d(0, ${offset * -0.03}px, 0)` }}
        >
          <div className="apple-device">
            <div className="apple-device__bar">
              <span />
              <span />
              <span />
            </div>
            <div className="apple-device__content">
              <div>
                <p className="eyebrow">Operational health</p>
                <h3>Everything the firm needs. Nothing it doesn’t.</h3>
              </div>
              <div className="showcase-metrics">
                {metrics.slice(0, 2).map((metric) => (
                  <div className="showcase-metric" key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span className="muted small">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {metrics.map((metric) => (
          <Card className="reveal" key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="metric-value">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted small" style={{ margin: 0 }}>{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="story-grid reveal">
        <Card className="story-card">
          <CardHeader>
            <p className="eyebrow">Scroll narrative</p>
            <CardTitle>Built for the rhythm of real legal work</CardTitle>
            <CardDescription>
              Intake, coordination, documentation, and hearing prep all live in the same system so teams stop losing context between tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="story-rail">
              <div>
                <h4>Intake</h4>
                <p className="muted small">Add clients and matters without breaking the workflow.</p>
              </div>
              <div>
                <h4>Coordination</h4>
                <p className="muted small">Schedule hearings and keep operational details visible.</p>
              </div>
              <div>
                <h4>Control</h4>
                <p className="muted small">Track documents and access inside a single secure surface.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="reveal">
          <CardHeader className="split">
            <div>
              <CardTitle>Upcoming hearings</CardTitle>
              <CardDescription>Next appearances that need preparation and coordination.</CardDescription>
            </div>
            <Badge variant="muted">{data.upcomingHearingsCount} scheduled</Badge>
          </CardHeader>
          <CardContent className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case Number</th>
                  <th>Matter</th>
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
                    <td><Badge variant="warning">{hearing.courtroom}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
