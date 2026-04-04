import { backendFetch } from "@/lib/backend";
import { DocumentsScreen } from "@/components/screens/documents-screen";

export default async function DocumentsPage() {
  const [documents, cases] = await Promise.all([
    backendFetch<Array<{
      id: number;
      fileName: string;
      documentType: string;
      contentType?: string;
      sizeBytes?: number;
      documentUrl?: string;
      summary?: string;
      caseId: number;
      caseTitle?: string;
      uploadedByName?: string;
    }>>("/documents"),
    backendFetch<Array<{ id: number; title: string }>>("/cases")
  ]);

  return (
    <DocumentsScreen
      initialDocuments={documents}
      cases={cases.map((entry) => ({ id: entry.id, title: entry.title }))}
    />
  );
}
