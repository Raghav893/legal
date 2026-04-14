import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const body = await request.json();
  const { data, error } = await supabase
    .from("cases")
    .update({ ...body })
    .eq("id", Number(params.id))
    .select("*, clients(fullName)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    ...data,
    clientName: (data as any).clients?.fullName || "",
    clients: undefined,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cases")
    .delete()
    .eq("id", Number(params.id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
