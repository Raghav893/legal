import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const db = await readDb();
  const user = db.users.find(
    (entry) => entry.email === body.email && entry.password === body.password
  );

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  await createSession({
    email: user.email,
    role: user.role,
    fullName: user.fullName
  });

  return NextResponse.json({
    email: user.email,
    role: user.role,
    fullName: user.fullName
  });
}
