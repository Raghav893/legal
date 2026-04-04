import { backendFetch } from "@/lib/backend";
import { CasesScreen } from "@/components/screens/cases-screen";

export default async function CasesPage() {
  const [cases, clients] = await Promise.all([
    backendFetch<Array<{
      id: number;
      caseNumber: string;
      title: string;
      status: string;
      courtName: string;
      judgeName: string;
      filingDate: string;
      clientId: number;
      clientName?: string;
    }>>("/cases"),
    backendFetch<Array<{ id: number; fullName: string }>>("/clients")
  ]);

  return (
    <CasesScreen
      initialCases={cases}
      clients={clients.map((client) => ({ id: client.id, fullName: client.fullName }))}
    />
  );
}
