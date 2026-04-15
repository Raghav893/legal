import { createClient } from "@/utils/supabase/server";
import { ClientsScreen } from "@/components/screens/clients-screen";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = createClient();
  const { data: clients } = await supabase.from('clients').select('*');
  return <ClientsScreen initialClients={clients || []} />;
}
