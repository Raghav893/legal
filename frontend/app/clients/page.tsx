import { backendFetch } from "@/lib/backend";
import { ClientsScreen } from "@/components/screens/clients-screen";

export default async function ClientsPage() {
  const clients = await backendFetch("/clients");
  return <ClientsScreen initialClients={clients} />;
}
