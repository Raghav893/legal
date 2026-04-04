import { NextResponse } from "next/server";
import { nextId, readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(
    db.cases.map((caseFile) => ({
      ...caseFile,
      clientName: db.clients.find((client) => client.id === caseFile.clientId)?.fullName || null
    }))
  );
}

export async function POST(request: Request) {
  const db = await readDb();
  const body = await request.json();
  const caseFile = { id: nextId(db.cases), ...body };
  db.cases.push(caseFile);
  await writeDb(db);
  return NextResponse.json(caseFile, { status: 201 });
}
