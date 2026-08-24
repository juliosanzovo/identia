"use client";

import { RiskChip, riskColor } from "@/components/ui/Chips";
import { Panel } from "@/components/ui/Panel";
import type { RiskAssessment } from "@/types";

function RadialScore({ score, level }: { score: number; level: RiskAssessment["nivel_risco"] }) {
  const radius = 44;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const maxArc = circumference * 0.75;
  const progress = (score / 100) * maxArc;
  const color = riskColor(level);

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg
        width={radius * 2}
        height={radius * 2}
        className="-rotate-[135deg]"
        aria-hidden
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#232C3D"
          strokeWidth={stroke}
          strokeDasharray={`${maxArc} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-medium text-paper">{score}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate">score</span>
      </div>
    </div>
  );
}

export function RiskVerdictCard({
  parecer,
}: {
  parecer: RiskAssessment | null | undefined;
}) {
  if (!parecer) {
    return (
      <Panel title="Parecer de risco (IA)">
        <p className="text-sm text-slate">
          Recomendação preliminar aparecerá após a análise.
        </p>
        <p className="mt-2 text-xs text-slate/80">
          A IA recomenda — a decisão final é sempre do analista.
        </p>
      </Panel>
    );
  }

  return (
    <Panel title="Parecer de risco (IA)" className="border-seal/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <RadialScore score={parecer.score} level={parecer.nivel_risco} />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <RiskChip level={parecer.nivel_risco} />
            <span className="font-mono text-xs uppercase text-slate">
              Recomenda: {parecer.recomendacao}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-paper">{parecer.justificativa}</p>
        </div>
      </div>

      {parecer.sinais_identificados.length > 0 && (
        <div className="mt-4 border-t border-hairline pt-4">
          <h4 className="mb-2 text-[11px] uppercase tracking-wider text-slate">
            Sinais identificados
          </h4>
          <ul className="space-y-1.5">
            {parecer.sinais_identificados.map((sinal) => (
              <li
                key={sinal}
                className="border-l border-hairline pl-3 font-mono text-xs text-paper/90"
              >
                {sinal}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-slate">
        Recomendação da IA — não substitui o julgamento do analista.
      </p>
    </Panel>
  );
}
