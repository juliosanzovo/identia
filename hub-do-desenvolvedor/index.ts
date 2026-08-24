import { isHubMockMode } from "./config";
import {
  mockConsultarCEP,
  mockConsultarCNPJ,
  mockConsultarCPF,
} from "./client/mock";
import {
  realConsultarCEP,
  realConsultarCNPJ,
  realConsultarCPF,
} from "./client/real";
import { assertValidCep } from "./validation/cep";
import { assertValidCnpj } from "./validation/cnpj";
import { assertValidCpf } from "./validation/cpf";
import type { CepResponse, CnpjResponse, CpfResponse } from "./types";

export type { CepResponse, CnpjResponse, CpfResponse, EnderecoHub } from "./types";
export {
  DocumentoInvalidoError,
  HubApiError,
  HubCreditError,
  HubError,
  HubServiceUnavailableError,
  RegistroNaoEncontradoError,
  hubErrorHttpStatus,
} from "./errors";
export { isValidCep, isValidCnpj, isValidCpf } from "./validation";

export async function consultarCPF(cpf: string): Promise<CpfResponse> {
  const digits = assertValidCpf(cpf);
  const consult = isHubMockMode() ? mockConsultarCPF : realConsultarCPF;
  return consult(digits);
}

export async function consultarCNPJ(cnpj: string): Promise<CnpjResponse> {
  const digits = assertValidCnpj(cnpj);
  const consult = isHubMockMode() ? mockConsultarCNPJ : realConsultarCNPJ;
  return consult(digits);
}

export async function consultarCEP(cep: string): Promise<CepResponse> {
  const digits = assertValidCep(cep);
  const consult = isHubMockMode() ? mockConsultarCEP : realConsultarCEP;
  return consult(digits);
}
