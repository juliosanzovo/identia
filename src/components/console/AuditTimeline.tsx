"use client";

import type { AuditEntry } from "@/types";

const ACTION_LABEL: Record<string, string> = {
  case_created: "Caso criado",
  analysis_started: "Análise iniciada",
  analysis_completed: "Análise concluída",
  decision_made: "Decisão registrada",
};

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));
}

export function AuditTimeline({
  entries,
  caseId,
}: {
  entries: AuditEntry[];
  caseId: string | null;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-hairline px-4 py-3">
        <h2 className="font-display text-sm font-medium text-paper">
          Auditoria
        </h2>
        {caseId && (
          <p className="mt-0.5 font-mono text-[11px] text-slate">
            Caso {caseId.slice(0, 8)}…
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {!caseId && (
          <p className="text-sm text-slate">Selecione um caso para ver o histórico.</p>
        )}

        {caseId && entries.length === 0 && (
          <p className="text-sm text-slate">Nenhum evento registrado.</p>
        )}

        <ol className="relative space-y-4 border-l border-hairline pl-4">
          {entries.map((entry) => (
            <li key={entry.id} className="relative">
              <span
                className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border border-seal/60 bg-ink"
                aria-hidden
              />
              <p className="font-sans text-sm text-paper">
                {ACTION_LABEL[entry.action] ?? entry.action}
              </p>
              {entry.details && (
                <p className="mt-0.5 text-xs text-slate">{entry.details}</p>
              )}
              <p className="mt-1 font-mono text-[11px] text-slate">
                {entry.actor} · {formatTime(entry.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
