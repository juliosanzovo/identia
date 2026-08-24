import documentoBom from "../fixtures/documento-bom.json";
import documentoBorrado from "../fixtures/documento-borrado.json";
import fotoDeTela from "../fixtures/foto-de-tela.json";
import manipulacao from "../fixtures/manipulacao.json";
import type { DocumentVisionAnalysis } from "../types";

type Scenario =
  | "documento-bom"
  | "documento-borrado"
  | "foto-de-tela"
  | "manipulacao";

const fixtures: Record<Scenario, DocumentVisionAnalysis> = {
  "documento-bom": documentoBom as DocumentVisionAnalysis,
  "documento-borrado": documentoBorrado as DocumentVisionAnalysis,
  "foto-de-tela": fotoDeTela as DocumentVisionAnalysis,
  manipulacao: manipulacao as DocumentVisionAnalysis,
};

export function resolveScenario(filenameHint: string): Scenario {
  const hint = filenameHint.toLowerCase();

  if (/blur|borrad|desfoc/.test(hint)) return "documento-borrado";
  if (/tela|screen|monitor|movel|celular/.test(hint)) return "foto-de-tela";
  if (/manip|fake|edit|fraude|adulter/.test(hint)) return "manipulacao";

  return "documento-bom";
}

export async function mockAnalisarDocumento(
  filenameHint: string
): Promise<DocumentVisionAnalysis> {
  const scenario = resolveScenario(filenameHint);
  return structuredClone(fixtures[scenario]);
}
