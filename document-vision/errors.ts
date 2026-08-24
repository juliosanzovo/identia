export class DocumentVisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentVisionError";
  }
}

export class ImagemInvalidaError extends DocumentVisionError {
  constructor(message = "Imagem inválida ou corrompida") {
    super(message);
    this.name = "ImagemInvalidaError";
  }
}

export class DocumentVisionApiError extends DocumentVisionError {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "DocumentVisionApiError";
    this.statusCode = statusCode;
  }
}

export function visionErrorHttpStatus(error: DocumentVisionError): number {
  if (error instanceof ImagemInvalidaError) return 400;
  if (error instanceof DocumentVisionApiError && error.statusCode) {
    return error.statusCode;
  }
  return 500;
}
