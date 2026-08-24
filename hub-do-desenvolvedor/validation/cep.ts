import { DocumentoInvalidoError } from "../errors";

export function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, "");
}

export function formatCep(digits: string): string {
  return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function isValidCep(cep: string): boolean {
  const digits = normalizeCep(cep);
  return digits.length === 8 && !/^(\d)\1{7}$/.test(digits);
}

export function assertValidCep(cep: string): string {
  const digits = normalizeCep(cep);
  if (!isValidCep(digits)) {
    throw new DocumentoInvalidoError("cep");
  }
  return digits;
}
