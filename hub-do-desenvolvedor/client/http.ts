import {
  DocumentoInvalidoError,
  HubApiError,
  HubCreditError,
  HubServiceUnavailableError,
  RegistroNaoEncontradoError,
} from "../errors";
import { hubConfig } from "../config";

export interface HubEnvelope {
  status?: boolean;
  return?: string;
  message?: string;
  result?: Record<string, unknown>;
}

const SERVICE_DOWN_PATTERNS = [
  "consulta não retornou",
  "timeout",
  "nao foi possivel obter o captcha",
  "erro ao obter retorno",
  "nao foi possivel conectar ao proxy",
  "erro ao requisitas ws",
];

const CREDIT_PATTERNS = [
  "token inválido ou sem saldo",
  "token invalido ou sem saldo",
  "limite excedido",
  "token bloqueado",
];

const NOT_FOUND_PATTERNS = [
  "cpf inválido",
  "cpf invalido",
  "cnpj nao existe",
  "cep nao encontrado",
  "formato desconhecido",
];

function normalizeMessage(message: string): string {
  return message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function classifyNokMessage(
  message: string,
  tipo: "cpf" | "cnpj" | "cep",
  documento: string
): never {
  const norm = normalizeMessage(message);

  if (CREDIT_PATTERNS.some((p) => norm.includes(normalizeMessage(p)))) {
    throw new HubCreditError(
      "Créditos da API cadastral esgotados ou token inválido. Contate o administrador do sistema."
    );
  }

  if (NOT_FOUND_PATTERNS.some((p) => norm.includes(normalizeMessage(p)))) {
    throw new RegistroNaoEncontradoError(tipo, documento);
  }

  if (norm.includes("parametro invalido") || norm.includes("nao informado")) {
    throw new DocumentoInvalidoError(
      tipo,
      `Documento ${tipo.toUpperCase()} inválido ou mal formatado.`
    );
  }

  if (SERVICE_DOWN_PATTERNS.some((p) => norm.includes(normalizeMessage(p)))) {
    throw new HubServiceUnavailableError(
      "Serviço cadastral temporariamente indisponível. Tente novamente em alguns minutos."
    );
  }

  throw new HubApiError(
    message.trim() || "Erro desconhecido na consulta cadastral."
  );
}

export async function fetchHub(
  resource: "cpf" | "cnpj" | "cep" | "cadastropf",
  params: Record<string, string>,
  tipo: "cpf" | "cnpj" | "cep",
  documento: string
): Promise<Record<string, unknown>> {
  const token = hubConfig.apiToken;
  if (!token) {
    throw new HubApiError("HUBDEV_API_KEY não configurado");
  }

  const query = new URLSearchParams({ json: "", ...params, token });
  const url = `${hubConfig.apiBaseUrl}/${resource}/?${query.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(hubConfig.requestTimeoutMs),
    });
  } catch {
    throw new HubServiceUnavailableError(
      "Serviço cadastral temporariamente indisponível. Tente novamente em alguns minutos."
    );
  }

  if (response.status >= 500) {
    throw new HubServiceUnavailableError(
      "Serviço cadastral temporariamente indisponível. Tente novamente em alguns minutos."
    );
  }

  let body: HubEnvelope;
  try {
    body = (await response.json()) as HubEnvelope;
  } catch {
    throw new HubApiError("Resposta inválida da API cadastral.", response.status);
  }

  if (body.return === "NOK") {
    classifyNokMessage(body.message ?? "", tipo, documento);
  }

  if (body.return !== "OK" || !body.result) {
    throw new HubApiError(
      body.message?.trim() || "Consulta cadastral não retornou dados.",
      response.status
    );
  }

  return body.result;
}
