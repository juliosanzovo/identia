import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { getCase } from "@/lib/store/cases";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const record = await getCase(params.id);
  if (!record) {
    return NextResponse.json({ error: "Caso não encontrado" }, { status: 404 });
  }

  try {
    const buffer = await readFile(record.imagePath);
    const ext = record.imagePath.split(".").pop()?.toLowerCase();
    const mime =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
  }
}
