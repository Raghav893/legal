import { backendFetch } from "@/lib/backend";
import { ClientsScreen } from "@/components/screens/clients-screen";

export default async function ClientsPage() {
  const clients = await backendFetch<Array<{
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    companyName?: string;
    notes?: string;
  }>>("/clients");
  return <ClientsScreen initialClients={clients} />;
}
