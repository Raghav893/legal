import { backendFetch } from "@/lib/backend";
import { DashboardScreen } from "@/components/screens/dashboard-screen";

export default async function HomePage() {
  const data = await backendFetch("/dashboard/summary");
  return <DashboardScreen data={data} />;
}
