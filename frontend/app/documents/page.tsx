import { createClient } from "@/utils/supabase/server";
import { DocumentsScreen } from "@/components/screens/documents-screen";

export default async function DocumentsPage() {
  const supabase = createClient();
  const [{ data: documents }, { data: cases }] = await Promise.all([
    supabase.from('documents').select('*, cases:caseId(title), profiles:uploadedBy(fullName)'),
    supabase.from('cases').select('id, title')
  ]);

  const formattedDocuments = (documents || []).map(d => ({
    ...d,
    caseTitle: d.cases?.title || '',
    uploadedByName: d.profiles?.fullName || ''
  }));

  return (
    <DocumentsScreen
      initialDocuments={formattedDocuments}
      cases={(cases || []).map((entry: any) => ({ id: entry.id, title: entry.title }))}
    />
  );
}
