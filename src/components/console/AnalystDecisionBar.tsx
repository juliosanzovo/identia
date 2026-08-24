"use client";

import { SealButton } from "@/components/ui/SealButton";
import { Panel } from "@/components/ui/Panel";
import type { AnalystDecision } from "@/types";

export function AnalystDecisionBar({
  disabled,
  loading,
  onDecide,
  currentDecision,
}: {
  disabled: boolean;
  loading: boolean;
  onDecide: (decision: AnalystDecision) => void;
  currentDecision?: AnalystDecision;
}) {
  return (
    <Panel title="Decisão do analista">
      {currentDecision ? (
        <p className="mb-3 font-mono text-sm text-paper">
          Decisão registrada:{" "}
          <span className="text-seal">{currentDecision}</span>
        </p>
      ) : (
        <p className="mb-3 text-sm text-slate">
          Registre sua decisão com base no dossiê e no parecer preliminar.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <SealButton
          disabled={disabled || loading || !!currentDecision}
          onClick={() => onDecide("approved")}
        >
          Aprovar
        </SealButton>
        <SealButton
          variant="ghost"
          disabled={disabled || loading || !!currentDecision}
          onClick={() => onDecide("needs_revision")}
        >
          Revisar
        </SealButton>
        <SealButton
          variant="ghost"
          disabled={disabled || loading || !!currentDecision}
          onClick={() => onDecide("rejected")}
          className="border-risk-high/40 text-risk-high hover:shadow-[0_0_12px_rgba(184,76,66,0.2)]"
        >
          Reprovar
        </SealButton>
      </div>
    </Panel>
  );
}
