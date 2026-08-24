"use client";

import { useCallback, useEffect, useState } from "react";
import { AnalystDecisionBar } from "@/components/console/AnalystDecisionBar";
import { AuditTimeline } from "@/components/console/AuditTimeline";
import { CaseQueue } from "@/components/console/CaseQueue";
import { CaseWorkspace } from "@/components/console/CaseWorkspace";
import { ConsoleLayout } from "@/components/console/ConsoleLayout";
import type { CaseRecord, CaseSummary } from "@/types/case-record";
import type { AnalystDecision } from "@/types";
import type { AuditEntry } from "@/types";

export function ConsolePage() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [mode, setMode] = useState<"new" | "view">("view");
  const [analyzing, setAnalyzing] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCases = useCallback(async () => {
    const res = await fetch("/api/cases");
    if (res.ok) setCases(await res.json());
  }, []);

  const loadCase = useCallback(async (id: string) => {
    const [caseRes, auditRes] = await Promise.all([
      fetch(`/api/cases/${id}`),
      fetch(`/api/audit?caseId=${id}`),
    ]);
    if (caseRes.ok) setSelectedCase(await caseRes.json());
    if (auditRes.ok) setAudit(await auditRes.json());
  }, []);

  useEffect(() => {
    refreshCases();
  }, [refreshCases]);

  useEffect(() => {
    if (selectedId) loadCase(selectedId);
    else {
      setSelectedCase(null);
      setAudit([]);
    }
  }, [selectedId, loadCase]);

  async function handleSelect(id: string) {
    setError(null);
    setMode("view");
    setSelectedId(id);
  }

  async function handleCreateCase(formData: FormData) {
    setError(null);
    const res = await fetch("/api/cases", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Erro ao criar caso");
      return;
    }
    await refreshCases();
    setSelectedId(data.id);
    setMode("view");
    setAnalyzing(true);
    try {
      const analyzeRes = await fetch(`/api/cases/${data.id}/analyze`, {
        method: "POST",
      });
      const analyzed = await analyzeRes.json();
      if (!analyzeRes.ok) {
        setError(analyzed.error ?? "Erro na análise");
      } else {
        setSelectedCase(analyzed);
        await refreshCases();
        await loadCase(data.id);
      }
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleAnalyze() {
    if (!selectedId) return;
    setError(null);
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/cases/${selectedId}/analyze`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro na análise");
        return;
      }
      setSelectedCase(data);
      await refreshCases();
      await loadCase(selectedId);
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDecide(decision: AnalystDecision) {
    if (!selectedId) return;
    setDeciding(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${selectedId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao registrar decisão");
        return;
      }
      setSelectedCase(data);
      await refreshCases();
      await loadCase(selectedId);
    } finally {
      setDeciding(false);
    }
  }

  return (
    <ConsoleLayout
      queue={
        <CaseQueue
          cases={cases}
          selectedId={selectedId}
          onSelect={handleSelect}
          onNewCase={() => {
            setMode("new");
            setSelectedId(null);
            setError(null);
          }}
        />
      }
      workspace={
        <CaseWorkspace
          mode={mode}
          selectedCase={selectedCase}
          analyzing={analyzing}
          onCreateCase={handleCreateCase}
          onAnalyze={handleAnalyze}
          error={error}
        />
      }
      sidebar={
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-hidden">
            <AuditTimeline entries={audit} caseId={selectedId} />
          </div>
          <div className="border-t border-hairline p-4">
            <AnalystDecisionBar
              disabled={!selectedCase?.parecer}
              loading={deciding}
              onDecide={handleDecide}
              currentDecision={selectedCase?.decision}
            />
          </div>
        </div>
      }
    />
  );
}
