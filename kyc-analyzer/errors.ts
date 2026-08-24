export class KycAnalyzerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KycAnalyzerError";
  }
}

export class KycAnalyzerApiError extends KycAnalyzerError {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "KycAnalyzerApiError";
    this.statusCode = statusCode;
  }
}

export class ParecerInvalidoError extends KycAnalyzerError {
  constructor(message: string) {
    super(message);
    this.name = "ParecerInvalidoError";
  }
}
