import { backendFetch } from "@/lib/backend";
import { CasesScreen } from "@/components/screens/cases-screen";

export default async function CasesPage() {
  const [cases, clients] = await Promise.all([
    backendFetch<Array<{
      id: number;
      caseNumber: string;
      title: string;
      description?: string;
      status: string;
      courtName: string;
      judgeName: string;
      filingDate: string;
      nextHearingDate?: string;
      clientId: number;
      clientName?: string;
      advocateId?: number;
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
