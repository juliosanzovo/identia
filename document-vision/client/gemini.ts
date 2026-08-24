import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import { visionConfig } from "../config";
import { DocumentVisionApiError } from "../errors";
import { VISION_SYSTEM_PROMPT } from "./prompt";
import type { PreparedImage } from "../types";

function ensureApiKey(): string {
  if (!visionConfig.apiKey) {
    throw new DocumentVisionApiError("GEMINI_API_KEY não configurado");
  }
  return visionConfig.apiKey;
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

export async function callGeminiVision(
  prepared: PreparedImage
): Promise<string> {
  const genAI = new GoogleGenerativeAI(ensureApiKey());
  const model = genAI.getGenerativeModel({
    model: visionConfig.model,
    systemInstruction: VISION_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  });

  const parts = [
    {
      inlineData: {
        mimeType: prepared.mimeType,
        data: prepared.buffer.toString("base64"),
      },
    },
    { text: "Analise o documento na imagem e retorne o JSON solicitado." },
  ];

  let lastError: unknown;

  for (let attempt = 0; attempt <= visionConfig.maxRetries; attempt++) {
    try {
      const result = await model.generateContent(parts);
      const text = result.response.text();
      if (!text?.trim()) {
        throw new DocumentVisionApiError(
          "Gemini retornou resposta vazia na análise visual."
        );
      }
      return text;
    } catch (error) {
      lastError = error;
      if (!isQuotaOrRateLimitError(error) || attempt === visionConfig.maxRetries) {
        throw error;
      }
      const delayMs = visionConfig.retryBaseMs * 2 ** attempt;
      await sleep(delayMs);
    }
  }

  throw lastError;
}

export function extractJsonPayload(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1].trim() : trimmed;
  try {
    return JSON.parse(raw);
  } catch {
    throw new DocumentVisionApiError(
      "Resposta da IA de visão não é JSON válido."
    );
  }
}
