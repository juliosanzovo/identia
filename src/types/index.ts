export type CaseStatus = "pending" | "in_review" | "approved" | "rejected" | "needs_revision";

export type AnalystDecision = "approved" | "rejected" | "needs_revision";

export type {
  ParecerRisco as RiskAssessment,
  NivelRisco,
  NivelRisco as RiskLevel,
  RecomendacaoParecer,
} from "kyc-analyzer";

export interface KycCase {
  id: string;
  document: string;
  documentType: "cpf" | "cnpj";
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export type {
  CepResponse as CepData,
  CnpjResponse as CnpjData,
  CpfResponse as CpfData,
  EnderecoHub as AddressData,
} from "hub-do-desenvolvedor";

export type {
  DocumentVisionAnalysis as VisionAnalysis,
  DadosExtraidos,
} from "document-vision";

export interface AuditEntry {
  id: string;
  caseId: string;
  action: string;
  actor: string;
  details?: string;
  createdAt: string;
}
