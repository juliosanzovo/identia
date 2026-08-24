import registry from "../fixtures/registry.json";
import { RegistroNaoEncontradoError } from "../errors";
import type { CepResponse, CnpjResponse, CpfResponse } from "../types";

type Registry = {
  cpf: Record<string, CpfResponse>;
  cnpj: Record<string, CnpjResponse>;
  cep: Record<string, CepResponse>;
};

const fixtures = registry as Registry;

export async function mockConsultarCPF(digits: string): Promise<CpfResponse> {
  const record = fixtures.cpf[digits];
  if (!record) {
    throw new RegistroNaoEncontradoError("cpf", digits);
  }
  return { ...record };
}

export async function mockConsultarCNPJ(digits: string): Promise<CnpjResponse> {
  const record = fixtures.cnpj[digits];
  if (!record) {
    throw new RegistroNaoEncontradoError("cnpj", digits);
  }
  return { ...record };
}

export async function mockConsultarCEP(digits: string): Promise<CepResponse> {
  const record = fixtures.cep[digits];
  if (!record) {
    throw new RegistroNaoEncontradoError("cep", digits);
  }
  return { ...record };
}
