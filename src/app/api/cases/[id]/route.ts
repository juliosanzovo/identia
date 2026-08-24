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
  return NextResponse.json(record);
}
