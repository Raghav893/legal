import { createClient } from "@/utils/supabase/server";
import { CasesScreen } from "@/components/screens/cases-screen";

export default async function CasesPage() {
  const supabase = createClient();
  const [{ data: cases }, { data: clients }] = await Promise.all([
    supabase.from('cases').select('*, clients(fullName)'),
    supabase.from('clients').select('id, fullName')
  ]);

  const formattedCases = (cases || []).map(c => ({
    ...c,
    clientName: c.clients?.fullName || ''
  }));

  return (
    <CasesScreen
      initialCases={formattedCases}
      clients={(clients || []).map((client: any) => ({ id: client.id, fullName: client.fullName }))}
    />
  );
}
