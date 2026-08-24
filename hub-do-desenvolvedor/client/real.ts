import { cacheKey, getCached, setCached } from "../cache";
import { fetchHub } from "./http";
import { mapCepResult, mapCnpjResult, mapCpfResult } from "./mappers";
import type { CepResponse, CnpjResponse, CpfResponse } from "../types";

export async function realConsultarCPF(digits: string): Promise<CpfResponse> {
  const key = cacheKey("cpf", digits);
  const cached = await getCached<CpfResponse>(key);
  if (cached) return cached;

  const result = await fetchHub("cpf", { cpf: digits }, "cpf", digits);
  const mapped = mapCpfResult(digits, result);
  await setCached(key, mapped);
  return mapped;
}

export async function realConsultarCNPJ(digits: string): Promise<CnpjResponse> {
  const key = cacheKey("cnpj", digits);
  const cached = await getCached<CnpjResponse>(key);
  if (cached) return cached;

  const result = await fetchHub("cnpj", { cnpj: digits }, "cnpj", digits);
  const mapped = mapCnpjResult(digits, result);
  await setCached(key, mapped);
  return mapped;
}

export async function realConsultarCEP(digits: string): Promise<CepResponse> {
  const key = cacheKey("cep", digits);
  const cached = await getCached<CepResponse>(key);
  if (cached) return cached;

  const result = await fetchHub("cep", { cep: digits }, "cep", digits);
  const mapped = mapCepResult(digits, result);
  await setCached(key, mapped);
  return mapped;
}
