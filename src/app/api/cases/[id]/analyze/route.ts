import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import {
  consultarCNPJ,
  consultarCPF,
  HubError,
  hubErrorHttpStatus,
} from "hub-do-desenvolvedor";
import {
  analisarDocumento,
  DocumentVisionError,
  visionErrorHttpStatus,
} from "document-vision";
import { gerarParecerRisco } from "kyc-analyzer";
import { appendAudit } from "@/lib/store/audit";
import { getCase, saveCase } from "@/lib/store/cases";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await getCase(params.id);
    if (!record) {
      return NextResponse.json({ error: "Caso não encontrado" }, { status: 404 });
    }

    record.status = "em_analise";
    record.updatedAt = new Date().toISOString();
    await saveCase(record);

    await appendAudit({
      caseId: record.id,
      action: "analysis_started",
      actor: "sistema",
      details: "Pipeline KYC iniciado",
    });

    const cadastral =
      record.documentType === "cpf"
        ? await consultarCPF(record.document)
        : await consultarCNPJ(record.document);

    const imageBuffer = await readFile(record.imagePath);
    const vision = await analisarDocumento({
      image: imageBuffer,
      filename: record.imageFilename,
    });

    const parecer = await gerarParecerRisco({ cadastral, visao: vision });

    record.cadastral = cadastral;
    record.vision = vision;
    record.parecer = parecer;
    record.status = "em_analise";
    record.updatedAt = new Date().toISOString();
    await saveCase(record);

    await appendAudit({
      caseId: record.id,
      action: "analysis_completed",
      actor: "sistema",
      details: `Parecer preliminar: ${parecer.nivel_risco} (score ${parecer.score})`,
    });

    return NextResponse.json(record);
  } catch (error) {
    if (error instanceof HubError || error instanceof DocumentVisionError) {
      const status =
        error instanceof HubError
          ? hubErrorHttpStatus(error)
          : visionErrorHttpStatus(error);

      await appendAudit({
        caseId: params.id,
        action: "analysis_failed",
        actor: "sistema",
        details: error.message,
      }).catch(() => undefined);

      return NextResponse.json(
        { error: error.message, code: error.name },
        { status }
      );
    }

    const message =
      error instanceof Error ? error.message : "Erro na análise";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
