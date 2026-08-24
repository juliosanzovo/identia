import type { DocumentVisionAnalysis } from "document-vision";
import type { CnpjResponse, CpfResponse } from "hub-do-desenvolvedor";
import { validarParecerRisco } from "../schema";
import {
  isCnpjResponse,
  isCpfResponse,
  type KycAnalyzerInput,
  type NivelRisco,
  type ParecerRisco,
  type RecomendacaoParecer,
} from "../types";

type Severidade = "critico" | "atencao" | "info";

interface Sinal {
  severidade: Severidade;
  descricao: string;
}

const SITUACOES_REGULARES = new Set([
  "regular",
  "ativa",
  "ativo",
  "habilitado",
  "habilitada",
]);

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function documentNumbersComparable(
  cadastral: CpfResponse | CnpjResponse,
  docImagemDigits: string
): boolean {
  if (isCpfResponse(cadastral)) return docImagemDigits.length === 11;
  return docImagemDigits.length === 14;
}

function namesMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return true;
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (!left || !right) return true;
  return left === right || left.includes(right) || right.includes(left);
}

function getCadastralName(cadastral: CpfResponse | CnpjResponse): string {
  if (isCpfResponse(cadastral)) return cadastral.nome;
  return cadastral.razaoSocial;
}

function getCadastralDocument(cadastral: CpfResponse | CnpjResponse): string {
  if (isCpfResponse(cadastral)) return cadastral.cpf;
  return cadastral.cnpj;
}

function getCadastralSituation(cadastral: CpfResponse | CnpjResponse): string {
  return cadastral.situacao;
}

function isSituationRegular(situacao: string): boolean {
  return SITUACOES_REGULARES.has(normalizeText(situacao));
}

function monthsSince(dateStr: string): number | null {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  return (
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth())
  );
}

function detectScreenPhotoIndicators(visao: DocumentVisionAnalysis): boolean {
  const combined = [
    ...visao.indicios_de_manipulacao,
    visao.motivo_qualidade,
    visao.observacoes_para_analista,
  ]
    .join(" ")
    .toLowerCase();

  return /tela|monitor|moire|moiré|screen|celular|interface/.test(combined);
}

function avaliarSinais(input: KycAnalyzerInput): Sinal[] {
  const { cadastral, visao } = input;
  const sinais: Sinal[] = [];

  if (!isSituationRegular(getCadastralSituation(cadastral))) {
    sinais.push({
      severidade: "critico",
      descricao: `Situação cadastral irregular: ${getCadastralSituation(cadastral)}`,
    });
  }

  if (visao.indicios_de_manipulacao.length > 0) {
    sinais.push({
      severidade: "critico",
      descricao: `Indícios de manipulação detectados: ${visao.indicios_de_manipulacao.join("; ")}`,
    });
  }

  const nomeCadastro = getCadastralName(cadastral);
  const nomeImagem = visao.dados_extraidos.nome;
  if (!namesMatch(nomeImagem, nomeCadastro)) {
    sinais.push({
      severidade: "critico",
      descricao: `Divergência de nome: cadastro "${nomeCadastro}" vs documento "${nomeImagem}"`,
    });
  }

  const docCadastro = onlyDigits(getCadastralDocument(cadastral));
  const docImagem = visao.dados_extraidos.numero
    ? onlyDigits(visao.dados_extraidos.numero)
    : null;
  if (
    docImagem &&
    docCadastro !== docImagem &&
    documentNumbersComparable(cadastral, docImagem)
  ) {
    sinais.push({
      severidade: "critico",
      descricao: `Divergência de documento: cadastro vs imagem`,
    });
  }

  if (visao.qualidade_imagem === "ruim") {
    sinais.push({
      severidade: "atencao",
      descricao: `Qualidade de imagem ruim: ${visao.motivo_qualidade}`,
    });
  }

  if (visao.confianca < 50) {
    sinais.push({
      severidade: "atencao",
      descricao: `Baixa confiança na análise visual (${visao.confianca}%)`,
    });
  }

  if (isCnpjResponse(cadastral) && cadastral.dataAbertura) {
    const meses = monthsSince(cadastral.dataAbertura);
    if (meses !== null && meses < 6) {
      sinais.push({
        severidade: "atencao",
        descricao: `Empresa aberta há menos de 6 meses (${cadastral.dataAbertura})`,
      });
    }
  }

  if (visao.qualidade_imagem === "regular" && detectScreenPhotoIndicators(visao)) {
    sinais.push({
      severidade: "atencao",
      descricao: "Possível foto de tela ou captura indireta do documento",
    });
  }

  if (sinais.length === 0) {
    sinais.push({
      severidade: "info",
      descricao: "Nenhum sinal de risco relevante identificado pelas regras",
    });
  }

  return sinais;
}

function calcularScore(sinais: Sinal[]): number {
  let score = 100;

  for (const sinal of sinais) {
    if (sinal.severidade === "critico") score -= 30;
    else if (sinal.severidade === "atencao") score -= 15;
    else if (sinal.severidade === "info") score -= 0;
  }

  return Math.max(0, Math.min(100, score));
}

function calcularNivelRisco(score: number, sinais: Sinal[]): NivelRisco {
  const temCritico = sinais.some((s) => s.severidade === "critico");
  if (temCritico && score < 50) return "alto";
  if (score >= 70 && !temCritico) return "baixo";
  if (score >= 40) return "medio";
  return "alto";
}

function calcularRecomendacao(
  nivel: NivelRisco,
  sinais: Sinal[]
): RecomendacaoParecer {
  const criticos = sinais.filter((s) => s.severidade === "critico");
  const temManipulacao = criticos.some((s) =>
    s.descricao.includes("manipulação")
  );
  const temSituacaoIrregular = criticos.some((s) =>
    s.descricao.includes("cadastral irregular")
  );
  const temDivergenciaDoc = criticos.some((s) =>
    s.descricao.includes("Divergência de documento")
  );

  if (temManipulacao || temSituacaoIrregular || temDivergenciaDoc) {
    return "reprovar";
  }

  if (nivel === "alto") return "revisar";
  if (nivel === "medio") return "revisar";
  return "aprovar";
}

function montarJustificativa(
  nivel: NivelRisco,
  sinais: Sinal[],
  recomendacao: RecomendacaoParecer
): string {
  const relevantes = sinais.filter((s) => s.severidade !== "info");
  const resumo =
    relevantes.length > 0
      ? relevantes.map((s) => s.descricao).join(". ")
      : sinais[0]?.descricao ?? "Análise concluída sem alertas.";

  return (
    `Parecer preliminar (recomendação: ${recomendacao}, risco ${nivel}). ` +
    `${resumo}. ` +
    "Esta é uma recomendação da IA — a decisão final cabe ao analista."
  );
}

export function gerarParecerPorRegras(input: KycAnalyzerInput): ParecerRisco {
  const sinais = avaliarSinais(input);
  const score = calcularScore(sinais);
  const nivel_risco = calcularNivelRisco(score, sinais);
  const recomendacao = calcularRecomendacao(nivel_risco, sinais);
  const justificativa = montarJustificativa(nivel_risco, sinais, recomendacao);

  const parecer: ParecerRisco = {
    nivel_risco,
    score,
    sinais_identificados: sinais.map((s) => s.descricao),
    justificativa,
    recomendacao,
  };

  return validarParecerRisco(parecer) as ParecerRisco;
}
