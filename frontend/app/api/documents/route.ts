import { NextResponse } from "next/server";
import { backendProxy } from "@/lib/backend";

export async function GET() {
  return backendProxy("/documents");
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let body: any;
  if (contentType.includes("multipart/form-data")) {
    body = await request.formData();
  } else {
    body = await request.json();
  }

  return backendProxy("/documents", {
    method: "POST",
    body: body
  });
}
