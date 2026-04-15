import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*, cases:caseId(title)")
    .order("id", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const formatted = (data || []).map((d: any) => ({
    ...d,
    caseTitle: d.cases?.title || "",
    cases: undefined,
  }));
  return NextResponse.json(formatted);
}

export async function POST(request: Request) {
  const supabase = createClient();

  // Get the authenticated user to set uploadedBy
  const { data: { user } } = await supabase.auth.getUser();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const documentType = formData.get("documentType") as string;
  const summary = formData.get("summary") as string;
  const caseId = Number(formData.get("caseId"));

  console.log("[documents] POST — file:", file?.name, "type:", documentType, "caseId:", caseId, "user:", user?.id);

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Upload file to Supabase Storage bucket named "documents"
  const storagePath = `${Date.now()}-${file.name}`;
  console.log("[documents] Uploading to storage path:", storagePath);

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file, { contentType: file.type });

  if (uploadError) {
    console.error("[documents] Storage upload failed:", uploadError.message);
    return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
  }

  console.log("[documents] Storage upload succeeded");

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("documents")
    .getPublicUrl(storagePath);

  console.log("[documents] Public URL:", urlData.publicUrl);

  // Insert record in DB
  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        "fileName": file.name,
        "documentType": documentType,
        "summary": summary,
        "caseId": caseId,
        "contentType": file.type,
        "sizeBytes": file.size,
        "documentUrl": urlData.publicUrl,
        "uploadedBy": user?.id ?? null,
      },
    ])
    .select("*, cases:caseId(title)")
    .single();

  if (error) {
    console.error("[documents] DB insert failed:", error.message, "| details:", error.details, "| hint:", error.hint);
    return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });
  }

  console.log("[documents] DB insert succeeded, id:", (data as any).id);

  return NextResponse.json(
    {
      ...data,
      caseTitle: (data as any).cases?.title || "",
      cases: undefined,
      uploadedByName: user?.email ?? "Unknown",
    },
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  const supabase = createClient();

  const { id } = await request.json() as { id: number };
  if (!id) return NextResponse.json({ error: "Missing document id" }, { status: 400 });

  // Fetch the document to get the storage path from its URL
  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("id, documentUrl")
    .eq("id", id)
    .single();

  if (fetchError || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Derive the storage path — it's the last segment of the public URL
  if (doc.documentUrl) {
    const storagePath = decodeURIComponent(doc.documentUrl.split("/").pop() ?? "");
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([storagePath]);
      if (storageError) {
        console.error("[documents] Storage delete failed:", storageError.message);
        // Non-fatal — continue to delete the DB row
      }
    }
  }

  // Delete the DB row
  const { error: dbError } = await supabase.from("documents").delete().eq("id", id);
  if (dbError) {
    console.error("[documents] DB delete failed:", dbError.message);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

