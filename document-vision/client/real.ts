import { mockAnalisarDocumento } from "./mock";
import {
  callGeminiVision,
  extractJsonPayload,
  isQuotaOrRateLimitError,
} from "./gemini";
import { DocumentVisionApiError } from "../errors";
import { validarAnaliseDocumento } from "../schema";
import type { DocumentVisionAnalysis, PreparedImage } from "../types";

const FALLBACK_NOTE =
  "Limite diário ou taxa da API Gemini atingida. Análise preliminar por regras — revisar o documento manualmente.";

async function fallbackPorRegras(
  filenameHint: string
): Promise<DocumentVisionAnalysis> {
  const baseline = await mockAnalisarDocumento(filenameHint);
  return {
    ...baseline,
    confianca: Math.min(baseline.confianca, 40),
    observacoes_para_analista: `${FALLBACK_NOTE} ${baseline.observacoes_para_analista}`,
  };
}

export async function realAnalisarDocumento(
  prepared: PreparedImage,
  filenameHint: string
): Promise<DocumentVisionAnalysis> {
  try {
    const rawText = await callGeminiVision(prepared);
    const parsed = extractJsonPayload(rawText);
    return validarAnaliseDocumento(parsed);
  } catch (error) {
    if (isQuotaOrRateLimitError(error)) {
      return fallbackPorRegras(filenameHint);
    }

    if (error instanceof DocumentVisionApiError) throw error;

    const message =
      error instanceof Error
        ? error.message
        : "Erro na análise visual do documento.";
    throw new DocumentVisionApiError(message);
  }
}
