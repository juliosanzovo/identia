import { mockAnalisarDocumento } from "./client/mock";
import { realAnalisarDocumento } from "./client/real";
import { isVisionMockMode } from "./config";
import { assertValidImage, loadImageBuffer } from "./image/load";
import { prepareImageForApi } from "./image/prepare";
import type {
  DocumentVisionAnalysis,
  DocumentVisionInput,
  PreparedImage,
} from "./types";

export type {
  DadosExtraidos,
  DocumentVisionAnalysis,
  DocumentVisionInput,
  PreparedImage,
  QualidadeImagem,
} from "./types";
export {
  DocumentVisionApiError,
  DocumentVisionError,
  ImagemInvalidaError,
  visionErrorHttpStatus,
} from "./errors";
export {
  DocumentVisionAnalysisSchema,
  validarAnaliseDocumento,
} from "./schema";
export { prepareImageForApi } from "./image/prepare";
export { resolveScenario } from "./client/mock";

export async function analisarDocumento(
  input: DocumentVisionInput
): Promise<DocumentVisionAnalysis> {
  const { buffer, hint } = await loadImageBuffer(input);
  await assertValidImage(buffer);

  if (isVisionMockMode()) {
    return mockAnalisarDocumento(hint);
  }

  const prepared = await prepareImageForApi(buffer);
  return realAnalisarDocumento(prepared, hint);
}
