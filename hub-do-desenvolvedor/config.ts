function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === "") return defaultValue;
  return value === "true" || value === "1";
}

export const hubConfig = {
  useMocks: parseBool(process.env.USE_MOCKS, true),
  apiToken:
    process.env.HUBDEV_API_KEY ?? process.env.HUB_API_TOKEN ?? "",
  apiBaseUrl:
    process.env.HUB_API_BASE_URL ?? "https://ws.hubdodesenvolvedor.com.br/v2",
  requestTimeoutMs: Number(process.env.HUB_REQUEST_TIMEOUT_MS ?? 60_000),
} as const;

export function isHubMockMode(): boolean {
  return hubConfig.useMocks;
}
