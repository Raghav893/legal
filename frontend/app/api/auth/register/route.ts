import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { getInternalApiBase } from "@/lib/backend";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${getInternalApiBase()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  const payload = await response.json();
  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  await createSession({
    id: payload.id,
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName,
    token: payload.token
  });

  return NextResponse.json(payload, { status: 201 });
}
