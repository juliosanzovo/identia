import { z } from "zod";
import type { DocumentVisionAnalysis } from "./types";

export const DadosExtraidosSchema = z.object({
  nome: z.string().nullable(),
  numero: z.string().nullable(),
  datas: z.array(z.string()),
});

export const DocumentVisionAnalysisSchema = z.object({
  tipo_documento_detectado: z.string().min(1),
  qualidade_imagem: z.enum(["boa", "regular", "ruim"]),
  motivo_qualidade: z.string().min(1),
  indicios_de_manipulacao: z.array(z.string()),
  dados_extraidos: DadosExtraidosSchema,
  confianca: z.number().min(0).max(100),
  observacoes_para_analista: z.string().min(1),
});

export function validarAnaliseDocumento(data: unknown): DocumentVisionAnalysis {
  return DocumentVisionAnalysisSchema.parse(data) as DocumentVisionAnalysis;
}
