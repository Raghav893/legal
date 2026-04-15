import { createClient } from "@/utils/supabase/server";
import { HearingsScreen } from "@/components/screens/hearings-screen";

export const dynamic = "force-dynamic";

export default async function HearingsPage() {
  const supabase = createClient();
  const [{ data: hearings }, { data: cases }] = await Promise.all([
    supabase.from('hearings').select('*, cases:caseId(title)'),
    supabase.from('cases').select('id, title')
  ]);

  const formattedHearings = (hearings || []).map(h => ({
    ...h,
    caseTitle: h.cases?.title || ''
  }));

  return (
    <HearingsScreen
      initialHearings={formattedHearings}
      cases={(cases || []).map((entry: any) => ({ id: entry.id, title: entry.title }))}
    />
  );
}
