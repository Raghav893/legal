import { backendFetch } from "@/lib/backend";
import { HearingsScreen } from "@/components/screens/hearings-screen";

export default async function HearingsPage() {
  const [hearings, cases] = await Promise.all([
    backendFetch("/hearings"),
    backendFetch("/cases")
  ]);

  return (
    <HearingsScreen
      initialHearings={hearings}
      cases={cases.map((entry: { id: number; title: string }) => ({ id: entry.id, title: entry.title }))}
    />
  );
}
