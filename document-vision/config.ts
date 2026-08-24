function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === "") return defaultValue;
  return value === "true" || value === "1";
}

export const visionConfig = {
  useMocks: parseBool(process.env.USE_MOCKS, true),
  apiKey:
    process.env.GEMINI_API_KEY ??
    process.env.VISION_API_KEY ??
    process.env.ANTHROPIC_API_KEY ??
    "",
  model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
  maxImageSidePx: 1024,
  jpegQuality: 85,
  maxRetries: 3,
  retryBaseMs: 1000,
} as const;

export function isVisionMockMode(): boolean {
  return visionConfig.useMocks;
}
