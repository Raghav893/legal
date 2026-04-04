import { NextResponse } from "next/server";
import { backendProxy } from "@/lib/backend";

export async function GET() {
  return backendProxy("/hearings");
}

export async function POST(request: Request) {
  const body = await request.json();
  return backendProxy("/hearings", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
