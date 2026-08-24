"use client";

import { FormEvent, useState } from "react";
import { SealButton } from "@/components/ui/SealButton";
import { CadastralPanel } from "./CadastralPanel";
import { RiskVerdictCard } from "./RiskVerdictCard";
import { VisionPanel } from "./VisionPanel";
import type { CaseRecord } from "@/types/case-record";

export function CaseWorkspace({
  mode,
  selectedCase,
  analyzing,
  onCreateCase,
  onAnalyze,
  error,
}: {
  mode: "new" | "view";
  selectedCase: CaseRecord | null;
  analyzing: boolean;
  onCreateCase: (data: FormData) => Promise<void>;
  onAnalyze: () => Promise<void>;
  error: string | null;
}) {
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("documentType", documentType);
    setSubmitting(true);
    try {
      await onCreateCase(formData);
      form.reset();
    } finally {
      setSubmitting(false);
    }
  }

  if (mode === "new") {
    return (
      <div className="space-y-4 p-4">
        <header>
          <h2 className="font-display text-lg font-medium text-paper">
            Novo caso
          </h2>
          <p className="mt-1 text-sm text-slate">
            Informe o documento e envie a foto para iniciar a análise KYC.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="panel-surface space-y-4 p-4"
        >
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate">
              Tipo
            </span>
            <div className="mt-2 flex gap-2">
              {(["cpf", "cnpj"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDocumentType(type)}
                  className={`seal-focus rounded border px-3 py-1.5 font-mono text-xs uppercase transition-shadow ${
                    documentType === type
                      ? "border-seal/50 text-seal shadow-seal"
                      : "border-hairline text-slate hover:shadow-seal-hover"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-slate">
              {documentType === "cpf" ? "CPF" : "CNPJ"}
            </span>
            <input
              name="document"
              required
              placeholder={
                documentType === "cpf"
                  ? "000.000.000-00"
                  : "00.000.000/0000-00"
              }
              className="seal-focus mt-1 w-full rounded border border-hairline bg-ink px-3 py-2 font-mono text-sm text-paper placeholder:text-slate/50"
            />
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-slate">
              Foto do documento
            </span>
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              className="seal-focus mt-1 block w-full text-sm text-slate file:mr-3 file:rounded file:border file:border-hairline file:bg-panel file:px-3 file:py-1.5 file:font-sans file:text-xs file:text-paper"
            />
          </label>

          {error && (
            <p className="text-sm text-risk-high" role="alert">
              {error}
            </p>
          )}

          <SealButton type="submit" disabled={submitting}>
            {submitting ? "Criando…" : "Criar caso"}
          </SealButton>
        </form>
      </div>
    );
  }

  if (!selectedCase) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-slate">
        Selecione um caso na fila ou crie um novo.
      </div>
    );
  }

  const imageUrl = `/api/cases/${selectedCase.id}/image`;
  const canAnalyze =
    !selectedCase.parecer && !analyzing && selectedCase.status !== "decidido";

  return (
    <div className="space-y-4 p-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium text-paper">
            Caso
          </h2>
          <p className="mt-1 font-mono text-sm text-slate">
            {selectedCase.documentType.toUpperCase()} · {selectedCase.document}
          </p>
        </div>
        {canAnalyze && (
          <SealButton onClick={onAnalyze} disabled={analyzing}>
            {analyzing ? "Analisando…" : "Executar análise"}
          </SealButton>
        )}
      </header>

      {error && (
        <p className="text-sm text-risk-high" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <VisionPanel
          vision={selectedCase.vision}
          imageUrl={imageUrl}
          scanning={analyzing}
        />
        <CadastralPanel cadastral={selectedCase.cadastral} />
      </div>

      <RiskVerdictCard parecer={selectedCase.parecer} />
    </div>
  );
}
