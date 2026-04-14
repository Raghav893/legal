import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  // TODO: Fetch dashboard summary from Supabase
  const data = {
    totalClients: 0,
    activeCases: 0,
    closedCases: 0,
    upcomingHearingsCount: 0,
    upcomingHearings: [],
  };
  
  return <DashboardScreen data={data} />;
}
