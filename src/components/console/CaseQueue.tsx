"use client";

import { StatusChip } from "@/components/ui/Chips";
import type { CaseSummary } from "@/types/case-record";

function formatDoc(summary: CaseSummary): string {
  return summary.document;
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function CaseQueue({
  cases,
  selectedId,
  onSelect,
  onNewCase,
}: {
  cases: CaseSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewCase: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <h2 className="font-display text-sm font-medium text-paper">Fila</h2>
        <button
          type="button"
          onClick={onNewCase}
          className="seal-focus rounded border border-seal/40 px-2 py-1 text-xs text-seal transition-shadow hover:shadow-seal-hover"
        >
          + Novo
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {cases.length === 0 && (
          <li className="px-4 py-6 text-sm text-slate">Nenhum caso ainda.</li>
        )}
        {cases.map((item) => {
          const active = item.id === selectedId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full border-b border-hairline px-4 py-3 text-left transition-colors ${
                  active ? "bg-panel/80 shadow-seal" : "hover:bg-panel/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs text-paper">
                    {formatDoc(item)}
                  </span>
                  <StatusChip status={item.status} />
                </div>
                <p className="mt-1 text-[11px] uppercase text-slate">
                  {item.documentType} · {formatTime(item.updatedAt)}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
