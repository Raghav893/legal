import { backendFetch } from "@/lib/backend";
import { DocumentsScreen } from "@/components/screens/documents-screen";

export default async function DocumentsPage() {
  const [documents, cases] = await Promise.all([
    backendFetch("/documents"),
    backendFetch("/cases")
  ]);

  return (
    <DocumentsScreen
      initialDocuments={documents}
      cases={cases.map((entry: { id: number; title: string }) => ({ id: entry.id, title: entry.title }))}
    />
  );
}
