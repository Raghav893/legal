import { NextResponse } from "next/server";
import { nextId, readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(
    db.hearings.map((hearing) => ({
      ...hearing,
      caseTitle: db.cases.find((entry) => entry.id === hearing.caseId)?.title || null
    }))
  );
}

export async function POST(request: Request) {
  const db = await readDb();
  const body = await request.json();
  const hearing = { id: nextId(db.hearings), ...body };
  db.hearings.push(hearing);
  await writeDb(db);
  return NextResponse.json(hearing, { status: 201 });
}
