import type { AnalystDecision } from "@/types";
import type { CnpjData, CpfData } from "@/types";
import type { RiskAssessment, VisionAnalysis } from "@/types";

export type ConsoleCaseStatus = "pendente" | "em_analise" | "decidido";

export interface CaseRecord {
  id: string;
  document: string;
  documentType: "cpf" | "cnpj";
  status: ConsoleCaseStatus;
  decision?: AnalystDecision;
  imagePath: string;
  imageFilename: string;
  cadastral?: CpfData | CnpjData | null;
  vision?: VisionAnalysis | null;
  parecer?: RiskAssessment | null;
  createdAt: string;
  updatedAt: string;
}

export type CaseSummary = Pick<
  CaseRecord,
  "id" | "document" | "documentType" | "status" | "decision" | "createdAt" | "updatedAt"
>;
