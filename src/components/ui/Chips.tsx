import type { ConsoleCaseStatus } from "@/types/case-record";
import type { NivelRisco } from "@/types";

const STATUS_LABEL: Record<ConsoleCaseStatus, string> = {
  pendente: "Pendente",
  em_analise: "Em análise",
  decidido: "Decidido",
};

const STATUS_CLASS: Record<ConsoleCaseStatus, string> = {
  pendente: "border-slate/40 text-slate",
  em_analise: "border-seal/50 text-seal",
  decidido: "border-risk-low/50 text-risk-low",
};

const RISK_LABEL: Record<NivelRisco, string> = {
  baixo: "Baixo",
  medio: "Médio",
  alto: "Alto",
};

const RISK_CLASS: Record<NivelRisco, string> = {
  baixo: "border-risk-low/60 text-risk-low bg-risk-low/10",
  medio: "border-risk-medium/60 text-risk-medium bg-risk-medium/10",
  alto: "border-risk-high/60 text-risk-high bg-risk-high/10",
};

export function StatusChip({ status }: { status: ConsoleCaseStatus }) {
  return (
    <span
      className={`inline-flex rounded border px-2 py-0.5 font-sans text-[11px] uppercase tracking-wide ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function RiskChip({ level }: { level: NivelRisco }) {
  return (
    <span
      className={`inline-flex rounded border px-2 py-0.5 font-sans text-[11px] uppercase tracking-wide ${RISK_CLASS[level]}`}
    >
      {RISK_LABEL[level]}
    </span>
  );
}

export function riskColor(level: NivelRisco): string {
  const map: Record<NivelRisco, string> = {
    baixo: "#4F9868",
    medio: "#C98A3B",
    alto: "#B84C42",
  };
  return map[level];
}
