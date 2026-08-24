"use client";

import { ReactNode, useState } from "react";

type Tab = "fila" | "caso" | "auditoria";

export function ConsoleLayout({
  queue,
  workspace,
  sidebar,
}: {
  queue: ReactNode;
  workspace: ReactNode;
  sidebar: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("caso");

  return (
    <div className="motion-safe:animate-console-enter flex min-h-screen flex-col bg-ink">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-3 lg:px-6">
        <div>
          <h1 className="font-display text-base font-medium tracking-wide text-paper">
            KYC Console
          </h1>
          <p className="text-xs text-slate">Análise cadastral e documental</p>
        </div>
      </header>

      <div className="flex border-b border-hairline lg:hidden">
        {(
          [
            ["fila", "Fila"],
            ["caso", "Caso"],
            ["auditoria", "Auditoria"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 py-2.5 text-center text-xs uppercase tracking-wide transition-colors ${
              tab === id
                ? "border-b-2 border-seal text-seal"
                : "text-slate"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid flex-1 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <aside
          className={`border-r border-hairline bg-panel/30 ${
            tab === "fila" ? "block" : "hidden"
          } lg:block`}
        >
          {queue}
        </aside>

        <main
          className={`min-w-0 overflow-y-auto ${
            tab === "caso" ? "block" : "hidden"
          } lg:block`}
        >
          {workspace}
        </main>

        <aside
          className={`border-l border-hairline bg-panel/20 ${
            tab === "auditoria" ? "block" : "hidden"
          } lg:block`}
        >
          {sidebar}
        </aside>
      </div>
    </div>
  );
}
