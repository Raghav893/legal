import { backendFetch } from "@/lib/backend";
import { DashboardScreen } from "@/components/screens/dashboard-screen";

export default async function HomePage() {
  const data = await backendFetch<{
    totalClients: number;
    activeCases: number;
    closedCases: number;
    upcomingHearingsCount: number;
    upcomingHearings: Array<{
      id: number;
      caseNumber: string;
      caseTitle: string;
      hearingDateTime: string;
      courtroom: string;
    }>;
  }>("/dashboard/summary");
  return <DashboardScreen data={data} />;
}
