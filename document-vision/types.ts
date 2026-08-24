export interface DadosExtraidos {
  nome: string | null;
  numero: string | null;
  datas: string[];
}

export type QualidadeImagem = "boa" | "regular" | "ruim";

export interface DocumentVisionAnalysis {
  tipo_documento_detectado: string;
  qualidade_imagem: QualidadeImagem;
  motivo_qualidade: string;
  indicios_de_manipulacao: string[];
  dados_extraidos: DadosExtraidos;
  confianca: number;
  observacoes_para_analista: string;
}

export type DocumentVisionInput =
  | { imagePath: string }
  | { image: Buffer; filename?: string };

export interface PreparedImage {
  buffer: Buffer;
  mimeType: "image/jpeg";
  width: number;
  height: number;
}
