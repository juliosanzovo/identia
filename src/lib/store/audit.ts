import { readJson, writeJson } from "@/lib/store/db";
import type { AuditEntry } from "@/types";

const FILE = "audit.json";

export async function listAudit(caseId?: string): Promise<AuditEntry[]> {
  const entries = await readJson<AuditEntry[]>(FILE, []);
  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!caseId) return sorted;
  return sorted.filter((entry) => entry.caseId === caseId);
}

export async function appendAudit(
  entry: Omit<AuditEntry, "id" | "createdAt"> & { createdAt?: string }
): Promise<AuditEntry> {
  const entries = await readJson<AuditEntry[]>(FILE, []);
  const record: AuditEntry = {
    id: crypto.randomUUID(),
    createdAt: entry.createdAt ?? new Date().toISOString(),
    ...entry,
  };
  entries.unshift(record);
  await writeJson(FILE, entries);
  return record;
}
