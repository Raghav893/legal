"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firmName, setFirmName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, role: "admin", firmName })
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.message || "Registration failed");
      setLoading(false);
      return;
    }

    setMessage("Account created. Redirecting to sign in…");
    setTimeout(() => router.push("/login"), 1000);
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your LexOra workspace"
      subtitle="One place for clients, matters, and documents—so your team stays aligned from day one."
    >
      <CardHeader className="space-y-2 pb-2 pt-8 text-center sm:pt-10">
        <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">
          Tell us who you are and which firm you&apos;re joining.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8 sm:px-10 sm:pb-10">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2 text-left">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              placeholder="Jane Doe"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 bg-white"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="firmName">Law firm name</Label>
            <Input
              id="firmName"
              placeholder="Doe Legal Partners"
              required
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className="h-11 bg-white"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="email">Work email</Label>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-white"
            />
          </div>
          <Button className="h-11 w-full rounded-[10px] text-[15px] font-semibold" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <div className="space-y-4 border-t border-border/60 pt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
          {message ? (
            <p
              className={
                message.includes("created") ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-red-600"
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
