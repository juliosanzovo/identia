import { gerarParecerPorRegras } from "../engine/rules";
import type { KycAnalyzerInput, ParecerRisco } from "../types";
import { analyzerConfig } from "../config";
import {
  gerarParecerComGemini,
  isQuotaOrRateLimitError,
} from "./gemini";

function fallbackPorRegras(
  input: KycAnalyzerInput,
  motivo: string
): ParecerRisco {
  const rules = gerarParecerPorRegras(input);
  return {
    ...rules,
    justificativa: `[${motivo}] ${rules.justificativa}`,
  };
}

export async function realGerarParecerRisco(
  input: KycAnalyzerInput
): Promise<ParecerRisco> {
  if (!analyzerConfig.useGemini || !analyzerConfig.geminiApiKey) {
    return gerarParecerPorRegras(input);
  }

  try {
    return await gerarParecerComGemini(input);
  } catch (error) {
    if (isQuotaOrRateLimitError(error)) {
      return fallbackPorRegras(
        input,
        "Análise por regras — limite Gemini atingido"
      );
    }
    return fallbackPorRegras(input, "Análise por regras — indisponibilidade temporária da IA");
  }
}
