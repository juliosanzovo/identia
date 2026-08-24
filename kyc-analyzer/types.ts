import type { CnpjResponse, CpfResponse } from "hub-do-desenvolvedor";
import type { DocumentVisionAnalysis } from "document-vision";

export type NivelRisco = "baixo" | "medio" | "alto";

export type RecomendacaoParecer = "aprovar" | "revisar" | "reprovar";

export interface ParecerRisco {
  nivel_risco: NivelRisco;
  score: number;
  sinais_identificados: string[];
  justificativa: string;
  recomendacao: RecomendacaoParecer;
}

export interface KycAnalyzerInput {
  cadastral: CpfResponse | CnpjResponse;
  visao: DocumentVisionAnalysis;
}

export function isCpfResponse(
  cadastral: CpfResponse | CnpjResponse
): cadastral is CpfResponse {
  return "nome" in cadastral;
}

export function isCnpjResponse(
  cadastral: CpfResponse | CnpjResponse
): cadastral is CnpjResponse {
  return "razaoSocial" in cadastral;
}
