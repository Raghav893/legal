import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*, clients(fullName)")
    .order("id", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const formatted = (data || []).map((c: any) => ({
    ...c,
    clientName: c.clients?.fullName || "",
    clients: undefined,
  }));
  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();
  const { data, error } = await supabase
    .from("cases")
    .insert([{ ...body }])
    .select("*, clients(fullName)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    { ...data, clientName: (data as any).clients?.fullName || "", clients: undefined },
    { status: 201 }
  );
}
