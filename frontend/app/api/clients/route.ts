import { NextResponse } from "next/server";
import { backendProxy } from "@/lib/backend";

export async function GET() {
  return backendProxy("/clients");
}

export async function POST(request: Request) {
  const body = await request.json();
  return backendProxy("/clients", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
