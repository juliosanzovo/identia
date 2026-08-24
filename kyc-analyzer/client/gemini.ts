import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import { analyzerConfig } from "../config";
import { KycAnalyzerApiError, ParecerInvalidoError } from "../errors";
import { validarParecerRisco } from "../schema";
import type { KycAnalyzerInput, ParecerRisco } from "../types";
import {
  ANALYZER_SYSTEM_PROMPT,
  buildAnalyzerUserPrompt,
} from "./prompt";

function ensureApiKey(): string {
  if (!analyzerConfig.geminiApiKey) {
    throw new KycAnalyzerApiError("GEMINI_API_KEY não configurado");
  }
  return analyzerConfig.geminiApiKey;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isQuotaOrRateLimitError(error: unknown): boolean {
  if (error instanceof GoogleGenerativeAIFetchError) {
    if (error.status === 429) return true;
    const combined = [
      error.message,
      ...(error.errorDetails?.map((d) => JSON.stringify(d)) ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return (
      combined.includes("quota") ||
      combined.includes("resource_exhausted") ||
      combined.includes("rate limit") ||
      combined.includes("too many requests")
    );
  }
  return false;
}

function extractJsonPayload(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1].trim() : trimmed;
  try {
    return JSON.parse(raw);
  } catch {
    throw new ParecerInvalidoError(
      "Resposta do Gemini no parecer não é JSON válido."
    );
  }
}

export async function gerarParecerComGemini(
  input: KycAnalyzerInput
): Promise<ParecerRisco> {
  const genAI = new GoogleGenerativeAI(ensureApiKey());
  const model = genAI.getGenerativeModel({
    model: analyzerConfig.model,
    systemInstruction: ANALYZER_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });

  const prompt = buildAnalyzerUserPrompt(input.cadastral, input.visao);
  let lastError: unknown;

  for (let attempt = 0; attempt <= analyzerConfig.maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text?.trim()) {
        throw new KycAnalyzerApiError("Gemini retornou parecer vazio.");
      }
      const parsed = extractJsonPayload(text);
      return validarParecerRisco(parsed) as ParecerRisco;
    } catch (error) {
      lastError = error;
      if (!isQuotaOrRateLimitError(error) || attempt === analyzerConfig.maxRetries) {
        throw error;
      }
      await sleep(analyzerConfig.retryBaseMs * 2 ** attempt);
    }
  }

  throw lastError;
}
