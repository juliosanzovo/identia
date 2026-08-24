import { mockGerarParecerRisco } from "./client/mock";
import { realGerarParecerRisco } from "./client/real";
import { isAnalyzerMockMode } from "./config";
import type { KycAnalyzerInput, ParecerRisco } from "./types";

export type {
  KycAnalyzerInput,
  NivelRisco,
  ParecerRisco,
  RecomendacaoParecer,
} from "./types";
export {
  KycAnalyzerApiError,
  KycAnalyzerError,
  ParecerInvalidoError,
} from "./errors";
export { ParecerRiscoSchema, validarParecerRisco } from "./schema";
export { gerarParecerPorRegras } from "./engine/rules";

export async function gerarParecerRisco(
  input: KycAnalyzerInput
): Promise<ParecerRisco> {
  const gerar = isAnalyzerMockMode()
    ? mockGerarParecerRisco
    : realGerarParecerRisco;
  return gerar(input);
}
