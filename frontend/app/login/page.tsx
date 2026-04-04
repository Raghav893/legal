"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@legalcase.local");
  const [password, setPassword] = useState("Admin@123");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      setMessage("Invalid email or password");
      setLoading(false);
      return;
    }

    setMessage("Login successful. Redirecting to dashboard...");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="auth-grid">
      <section className="showcase-panel">
        <div>
          <p className="eyebrow">Legal practice management</p>
          <h1 className="hero-title">Operate your law firm from one calm, structured workspace.</h1>
          <p className="hero-copy">
            Track matters, organize hearings, maintain client records, and keep advocates and assistants aligned in a clean B2B workflow.
          </p>
          <div className="showcase-metrics">
            <div className="showcase-metric">
              <strong>94%</strong>
              <span className="muted small">hearing readiness coverage this quarter</span>
            </div>
            <div className="showcase-metric">
              <strong>220+</strong>
              <span className="muted small">documents centrally tracked across live matters</span>
            </div>
            <div className="showcase-metric">
              <strong>18</strong>
              <span className="muted small">advocates and assistants collaborating securely</span>
            </div>
            <div className="showcase-metric">
              <strong>1</strong>
              <span className="muted small">single source of truth for the firm operations team</span>
            </div>
          </div>
        </div>
        <p className="muted small">
          Built for boutique and mid-market law firms that need discipline, clarity, and secure team coordination.
        </p>
      </section>

      <Card className="auth-panel">
        <CardContent>
          <p className="eyebrow">Sign in</p>
          <h2 className="ui-card__title" style={{ fontSize: 32, marginBottom: 8 }}>Welcome back</h2>
          <p className="ui-card__description" style={{ marginBottom: 24 }}>
            Access your firm dashboard, case pipeline, hearing calendar, and document workspace.
          </p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Enter Workspace"}
            </Button>
          </form>
          <div style={{ marginTop: 18 }}>
            <p className="muted small">Demo credentials</p>
            <p className="small" style={{ margin: "6px 0 0" }}>admin@legalcase.local / Admin@123</p>
          </div>
          <p className="muted small" style={{ marginTop: 16 }}>
            New to the workspace? <Link href="/signup">Create an account</Link>
          </p>
          {message ? <p className="muted small" style={{ marginTop: 16 }}>{message}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
