import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { appendAudit } from "@/lib/store/audit";
import { listCases, saveCase, toSummary } from "@/lib/store/cases";
import { dataPath, ensureDataDir } from "@/lib/store/db";
import type { CaseRecord } from "@/types/case-record";

export async function GET() {
  const cases = await listCases();
  return NextResponse.json(cases.map(toSummary));
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const documentType = formData.get("documentType");
    const document = formData.get("document");
    const image = formData.get("image");

    if (documentType !== "cpf" && documentType !== "cnpj") {
      return NextResponse.json(
        { error: "Tipo de documento inválido" },
        { status: 400 }
      );
    }

    if (typeof document !== "string" || !document.trim()) {
      return NextResponse.json(
        { error: "CPF/CNPJ é obrigatório" },
        { status: 400 }
      );
    }

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { error: "Foto do documento é obrigatória" },
        { status: 400 }
      );
    }

    await ensureDataDir();
    const id = crypto.randomUUID();
    const ext = path.extname(image.name) || ".jpg";
    const imageFilename = image.name;
    const imagePath = dataPath("uploads", `${id}${ext}`);
    const buffer = Buffer.from(await image.arrayBuffer());
    await writeFile(imagePath, buffer);

    const now = new Date().toISOString();
    const record: CaseRecord = {
      id,
      document: document.trim(),
      documentType,
      status: "pendente",
      imagePath,
      imageFilename,
      cadastral: null,
      vision: null,
      parecer: null,
      createdAt: now,
      updatedAt: now,
    };

    await saveCase(record);
    await appendAudit({
      caseId: id,
      action: "case_created",
      actor: "analista",
      details: `Caso criado (${documentType.toUpperCase()})`,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao criar caso";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
