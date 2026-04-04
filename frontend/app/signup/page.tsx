"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ASSISTANT"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const error = await response.json();
      setMessage(error.message || "Unable to create account");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="auth-grid">
      <section className="showcase-panel">
        <div>
          <p className="eyebrow">Team onboarding</p>
          <h1 className="hero-title">Bring advocates and assistants into a structured, secure workspace.</h1>
          <p className="hero-copy">
            Create operational access for firm staff, assign roles, and start managing legal work without waiting on a separate backend admin console.
          </p>
        </div>
        <p className="muted small">
          For stricter production environments, this can evolve into invite-only onboarding and approval workflows.
        </p>
      </section>

      <Card className="auth-panel">
        <CardContent>
          <p className="eyebrow">Create account</p>
          <h2 className="ui-card__title" style={{ fontSize: 32, marginBottom: 8 }}>Set up your workspace access</h2>
          <p className="ui-card__description" style={{ marginBottom: 24 }}>
            Register a user with a role appropriate for law firm operations.
          </p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <Input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            <Input type="email" placeholder="Work email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <select className="ui-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="ADMIN">Admin</option>
              <option value="ADVOCATE">Advocate</option>
              <option value="ASSISTANT">Assistant</option>
            </select>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="muted small" style={{ marginTop: 16 }}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
          {message ? <p className="muted small" style={{ marginTop: 12 }}>{message}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
