export class HubError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HubError";
  }
}

export class DocumentoInvalidoError extends HubError {
  readonly tipo: "cpf" | "cnpj" | "cep";

  constructor(tipo: "cpf" | "cnpj" | "cep", message?: string) {
    super(message ?? `${tipo.toUpperCase()} inválido`);
    this.name = "DocumentoInvalidoError";
    this.tipo = tipo;
  }
}

export class RegistroNaoEncontradoError extends HubError {
  readonly tipo: "cpf" | "cnpj" | "cep";
  readonly documento: string;

  constructor(tipo: "cpf" | "cnpj" | "cep", documento: string) {
    super(`${tipo.toUpperCase()} não encontrado na base`);
    this.name = "RegistroNaoEncontradoError";
    this.tipo = tipo;
    this.documento = documento;
  }
}

export class HubApiError extends HubError {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "HubApiError";
    this.statusCode = statusCode;
  }
}

export class HubCreditError extends HubError {
  constructor(message: string) {
    super(message);
    this.name = "HubCreditError";
  }
}

export class HubServiceUnavailableError extends HubError {
  constructor(message: string) {
    super(message);
    this.name = "HubServiceUnavailableError";
  }
}

export function hubErrorHttpStatus(error: HubError): number {
  if (error instanceof DocumentoInvalidoError) return 400;
  if (error instanceof RegistroNaoEncontradoError) return 404;
  if (error instanceof HubCreditError) return 402;
  if (error instanceof HubServiceUnavailableError) return 503;
  if (error instanceof HubApiError && error.statusCode) return error.statusCode;
  return 500;
}
