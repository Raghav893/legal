import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hearings")
    .select("*, cases:caseId(title)")
    .order("hearingDateTime", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const formatted = (data || []).map((h: any) => ({
    ...h,
    caseTitle: h.cases?.title || "",
    cases: undefined,
  }));
  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();
  const { data, error } = await supabase
    .from("hearings")
    .insert([{ ...body }])
    .select("*, cases:caseId(title)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    { ...data, caseTitle: (data as any).cases?.title || "", cases: undefined },
    { status: 201 }
  );
}
