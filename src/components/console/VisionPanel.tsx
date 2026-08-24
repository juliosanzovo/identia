"use client";

import { Panel } from "@/components/ui/Panel";
import type { VisionAnalysis } from "@/types";
import { DocumentScanThumbnail } from "./DocumentScanThumbnail";

export function VisionPanel({
  vision,
  imageUrl,
  scanning,
}: {
  vision: VisionAnalysis | null | undefined;
  imageUrl?: string;
  scanning: boolean;
}) {
  return (
    <Panel title="Análise de imagem">
      {imageUrl && (
        <div className="mb-4">
          <DocumentScanThumbnail
            src={imageUrl}
            alt="Documento enviado"
            scanning={scanning}
          />
          {scanning && (
            <p className="mt-2 font-mono text-xs text-seal">
              Verificando documento…
            </p>
          )}
        </div>
      )}

      {!vision && !scanning && (
        <p className="text-sm text-slate">Aguardando análise.</p>
      )}

      {vision && (
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-slate">
              Tipo detectado
            </dt>
            <dd className="font-mono text-sm text-paper">
              {vision.tipo_documento_detectado}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-slate">
              Qualidade
            </dt>
            <dd className="font-mono text-sm capitalize text-paper">
              {vision.qualidade_imagem}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] uppercase tracking-wider text-slate">
              Motivo
            </dt>
            <dd className="text-sm text-paper">{vision.motivo_qualidade}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-slate">
              Confiança
            </dt>
            <dd className="font-mono text-sm text-paper">{vision.confianca}%</dd>
          </div>
          {vision.dados_extraidos.nome && (
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-slate">
                Nome extraído
              </dt>
              <dd className="font-mono text-sm text-paper">
                {vision.dados_extraidos.nome}
              </dd>
            </div>
          )}
          {vision.indicios_de_manipulacao.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="mb-1 text-[11px] uppercase tracking-wider text-slate">
                Indícios
              </dt>
              <ul className="space-y-1 text-sm text-paper">
                {vision.indicios_de_manipulacao.map((item) => (
                  <li key={item} className="border-l-2 border-risk-high/50 pl-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-[11px] uppercase tracking-wider text-slate">
              Observações
            </dt>
            <dd className="text-sm text-slate">
              {vision.observacoes_para_analista}
            </dd>
          </div>
        </dl>
      )}
    </Panel>
  );
}
