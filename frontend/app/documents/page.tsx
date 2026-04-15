import { createClient } from "@/utils/supabase/server";
import { DocumentsScreen } from "@/components/screens/documents-screen";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const supabase = createClient();
  const [{ data: documents, error: docsError }, { data: cases }] = await Promise.all([
    supabase
      .from("documents")
      .select("id, fileName, documentType, contentType, sizeBytes, documentUrl, summary, caseId, uploadedBy")
      .order("id", { ascending: false }),
    supabase.from("cases").select("id, title"),
  ]);

  if (docsError) {
    console.error("[DocumentsPage] fetch error:", docsError.message);
  }

  const casesMap = Object.fromEntries((cases || []).map((c: any) => [c.id, c.title]));

  const formattedDocuments = (documents || []).map((d: any) => ({
    ...d,
    caseTitle: casesMap[d.caseId] || "",
    uploadedByName: "",
  }));

  return (
    <DocumentsScreen
      initialDocuments={formattedDocuments}
      cases={(cases || []).map((entry: any) => ({ id: entry.id, title: entry.title }))}
    />
  );
}
