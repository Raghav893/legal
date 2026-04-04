import { NextResponse } from "next/server";
import { backendProxy } from "@/lib/backend";

export async function GET() {
  return backendProxy("/dashboard/summary");
}
