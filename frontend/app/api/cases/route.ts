import { NextResponse } from "next/server";
import { backendProxy } from "@/lib/backend";

export async function GET() {
  return backendProxy("/cases");
}

export async function POST(request: Request) {
  const body = await request.json();
  return backendProxy("/cases", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
