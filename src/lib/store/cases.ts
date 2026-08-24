import { readJson, writeJson } from "@/lib/store/db";
import type { CaseRecord, CaseSummary } from "@/types/case-record";

const FILE = "cases.json";

export async function listCases(): Promise<CaseRecord[]> {
  return readJson<CaseRecord[]>(FILE, []);
}

export async function getCase(id: string): Promise<CaseRecord | null> {
  const cases = await listCases();
  return cases.find((item) => item.id === id) ?? null;
}

export async function saveCase(record: CaseRecord): Promise<void> {
  const cases = await listCases();
  const index = cases.findIndex((item) => item.id === record.id);
  if (index >= 0) cases[index] = record;
  else cases.unshift(record);
  await writeJson(FILE, cases);
}

export function toSummary(record: CaseRecord): CaseSummary {
  return {
    id: record.id,
    document: record.document,
    documentType: record.documentType,
    status: record.status,
    decision: record.decision,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}
