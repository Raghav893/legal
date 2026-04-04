import { promises as fs } from "fs";
import path from "path";

export type AppDb = {
  users: Array<{ id: number; fullName: string; email: string; password: string; role: string }>;
  clients: Array<{ id: number; fullName: string; email: string; phone: string; address: string; companyName?: string; notes?: string }>;
  cases: Array<{ id: number; caseNumber: string; title: string; description: string; courtName: string; judgeName: string; status: string; filingDate: string; nextHearingDate?: string; clientId: number; advocateId?: number }>;
  hearings: Array<{ id: number; caseId: number; hearingDateTime: string; courtroom: string; agenda: string; outcome?: string; reminderSent: boolean }>;
  documents: Array<{ id: number; caseId: number; fileName: string; documentType: string; contentType: string; sizeBytes: number; uploadedById: number; uploadedAt: string }>;
};

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function readDb(): Promise<AppDb> {
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as AppDb;
}

export async function writeDb(data: AppDb) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export function nextId(items: Array<{ id: number }>) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}
