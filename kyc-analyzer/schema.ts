import { z } from "zod";

export const ParecerRiscoSchema = z.object({
  nivel_risco: z.enum(["baixo", "medio", "alto"]),
  score: z.number().min(0).max(100),
  sinais_identificados: z.array(z.string()),
  justificativa: z.string().min(1),
  recomendacao: z.enum(["aprovar", "revisar", "reprovar"]),
});

export type ParecerRiscoValidated = z.infer<typeof ParecerRiscoSchema>;

export function validarParecerRisco(data: unknown): ParecerRiscoValidated {
  return ParecerRiscoSchema.parse(data);
}
