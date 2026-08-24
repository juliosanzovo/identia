function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === "") return defaultValue;
  return value === "true" || value === "1";
}

export const analyzerConfig = {
  useMocks: parseBool(process.env.USE_MOCKS, true),
  useGemini: parseBool(process.env.KYC_ANALYZER_USE_GEMINI, true),
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
  maxRetries: 3,
  retryBaseMs: 1000,
} as const;

export function isAnalyzerMockMode(): boolean {
  return analyzerConfig.useMocks;
}
