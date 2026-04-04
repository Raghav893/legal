import { NextResponse } from "next/server";
import { nextId, readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.clients);
}

export async function POST(request: Request) {
  const db = await readDb();
  const body = await request.json();
  const client = { id: nextId(db.clients), ...body };
  db.clients.push(client);
  await writeDb(db);
  return NextResponse.json(client, { status: 201 });
}
