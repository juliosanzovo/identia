import { DocumentoInvalidoError } from "../errors";

const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

export function normalizeCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

export function formatCnpj(digits: string): string {
  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
}

function calcCheckDigit(base: string, weights: number[]): number {
  const sum = base
    .split("")
    .reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(cnpj: string): boolean {
  const digits = normalizeCnpj(cnpj);

  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const base = digits.slice(0, 12);
  const first = calcCheckDigit(base, FIRST_WEIGHTS);
  if (first !== Number(digits[12])) return false;

  const second = calcCheckDigit(base + first, SECOND_WEIGHTS);
  return second === Number(digits[13]);
}

export function assertValidCnpj(cnpj: string): string {
  const digits = normalizeCnpj(cnpj);
  if (!isValidCnpj(digits)) {
    throw new DocumentoInvalidoError("cnpj");
  }
  return digits;
}
