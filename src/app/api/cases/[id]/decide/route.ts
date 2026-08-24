import { NextResponse } from "next/server";
import { appendAudit } from "@/lib/store/audit";
import { getCase, saveCase } from "@/lib/store/cases";
import type { AnalystDecision } from "@/types";

const VALID: AnalystDecision[] = ["approved", "rejected", "needs_revision"];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as { decision?: AnalystDecision };
    const decision = body.decision;

    if (!decision || !VALID.includes(decision)) {
      return NextResponse.json(
        { error: "Decisão inválida" },
        { status: 400 }
      );
    }

    const record = await getCase(params.id);
    if (!record) {
      return NextResponse.json({ error: "Caso não encontrado" }, { status: 404 });
    }

    if (!record.parecer) {
      return NextResponse.json(
        { error: "Análise ainda não concluída" },
        { status: 400 }
      );
    }

    record.decision = decision;
    record.status = "decidido";
    record.updatedAt = new Date().toISOString();
    await saveCase(record);

    const labels: Record<AnalystDecision, string> = {
      approved: "aprovado",
      rejected: "reprovado",
      needs_revision: "revisão solicitada",
    };

    await appendAudit({
      caseId: record.id,
      action: "decision_made",
      actor: "analista",
      details: `Decisão: ${labels[decision]}`,
    });

    return NextResponse.json(record);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao registrar decisão";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
