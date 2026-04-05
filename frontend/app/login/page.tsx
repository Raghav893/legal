"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    setMessage("Login successful. Redirecting…");
    window.location.href = "/dashboard";
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      subtitle="Access matters, clients, hearings, and documents in one calm, structured view."
    >
      <CardHeader className="space-y-2 pb-2 pt-8 text-center sm:pt-10">
        <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">
          Use your firm email and password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8 sm:px-10 sm:pb-10">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2 text-left">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@firm.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-white"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-white"
            />
          </div>
          <Button className="h-11 w-full rounded-[10px] text-[15px] font-semibold" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="space-y-4 border-t border-border/60 pt-6 text-center text-sm">
          <p className="text-muted-foreground">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Create one
            </Link>
          </p>
          {message ? (
            <p
              className={
                message.includes("successful") ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-red-600"
              }
            >
              {message}
            </p>
          ) : null}
        </div>
      </CardContent>
    </AuthLayout>
  );
}
