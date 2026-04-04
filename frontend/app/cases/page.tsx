import { backendFetch } from "@/lib/backend";
import { CasesScreen } from "@/components/screens/cases-screen";

export default async function CasesPage() {
  const [cases, clients] = await Promise.all([
    backendFetch("/cases"),
    backendFetch("/clients")
  ]);

  return (
    <CasesScreen
      initialCases={cases}
      clients={clients.map((client: { id: number; fullName: string }) => ({ id: client.id, fullName: client.fullName }))}
    />
  );
}
