import { gerarParecerPorRegras } from "../engine/rules";
import type { KycAnalyzerInput, ParecerRisco } from "../types";

export async function mockGerarParecerRisco(
  input: KycAnalyzerInput
): Promise<ParecerRisco> {
  return gerarParecerPorRegras(input);
}
