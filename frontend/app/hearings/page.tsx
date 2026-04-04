import { backendFetch } from "@/lib/backend";
import { HearingsScreen } from "@/components/screens/hearings-screen";

export default async function HearingsPage() {
  const [hearings, cases] = await Promise.all([
    backendFetch<Array<{
      id: number;
      caseId: number;
      caseTitle?: string;
      hearingDateTime: string;
      courtroom: string;
      agenda: string;
    }>>("/hearings"),
    backendFetch<Array<{ id: number; title: string }>>("/cases")
  ]);

  return (
    <HearingsScreen
      initialHearings={hearings}
      cases={cases.map((entry) => ({ id: entry.id, title: entry.title }))}
    />
  );
}
