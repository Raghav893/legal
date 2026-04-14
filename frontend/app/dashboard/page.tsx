import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const now = new Date().toISOString();

  const [
    { count: totalClients },
    { count: activeCases },
    { count: closedCases },
    { data: upcomingHearings },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("cases").select("*", { count: "exact", head: true }).in("status", ["OPEN", "IN_PROGRESS"]),
    supabase.from("cases").select("*", { count: "exact", head: true }).eq("status", "CLOSED"),
    supabase
      .from("hearings")
      .select(`id, "hearingDateTime", courtroom, cases:caseId(id, "caseNumber", title)`)
      .gte("hearingDateTime", now)
      .order("hearingDateTime", { ascending: true })
      .limit(10),
  ]);

  const formattedHearings = (upcomingHearings || []).map((h: any) => ({
    id: h.id,
    caseNumber: h.cases?.caseNumber ?? "—",
    caseTitle: h.cases?.title ?? "—",
    hearingDateTime: h.hearingDateTime,
    courtroom: h.courtroom,
  }));

  const data = {
    totalClients: totalClients ?? 0,
    activeCases: activeCases ?? 0,
    closedCases: closedCases ?? 0,
    upcomingHearingsCount: formattedHearings.length,
    upcomingHearings: formattedHearings,
  };

  return <DashboardScreen data={data} />;
}
