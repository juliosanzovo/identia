import { NextResponse } from "next/server";
import { listAudit } from "@/lib/store/audit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get("caseId") ?? undefined;
  const entries = await listAudit(caseId);
  return NextResponse.json(entries);
}
