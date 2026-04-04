import { NextResponse } from "next/server";
import { nextId, readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(
    db.documents.map((document) => ({
      ...document,
      caseTitle: db.cases.find((entry) => entry.id === document.caseId)?.title || null,
      uploadedByName: db.users.find((entry) => entry.id === document.uploadedById)?.fullName || null
    }))
  );
}

export async function POST(request: Request) {
  const db = await readDb();
  const body = await request.json();
  const document = {
    id: nextId(db.documents),
    uploadedAt: new Date().toISOString(),
    ...body
  };
  db.documents.push(document);
  await writeDb(db);
  return NextResponse.json(document, { status: 201 });
}
