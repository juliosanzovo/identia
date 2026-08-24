import { formatCep } from "../validation/cep";
import { formatCnpj } from "../validation/cnpj";
import { formatCpf } from "../validation/cpf";
import type { CepResponse, CnpjResponse, CpfResponse, EnderecoHub } from "../types";

function str(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function hubDateToIso(value: string): string {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return value;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function mapEndereco(result: Record<string, unknown>): EnderecoHub | undefined {
  const logradouro = str(result.logradouro);
  if (!logradouro) return undefined;

  const cepDigits = str(result.cep).replace(/\D/g, "");
  return {
    logradouro,
    numero: str(result.numero) || "S/N",
    complemento: str(result.complemento) || undefined,
    bairro: str(result.bairro),
    cidade: str(result.municipio || result.localidade || result.cidade),
    uf: str(result.uf),
    cep: cepDigits.length === 8 ? formatCep(cepDigits) : str(result.cep),
  };
}

export function mapCpfResult(
  digits: string,
  result: Record<string, unknown>
): CpfResponse {
  const cpfDigits = str(result.numero_de_cpf || result.documento || digits).replace(
    /\D/g,
    ""
  );
  const nascimento = str(result.data_nascimento || result.dataDeNascimento);
  const situacao = str(result.situacao_cadastral || result.situacao);

  return {
    cpf: formatCpf(cpfDigits || digits),
    nome: str(result.nome_da_pf || result.nomeCompleto || result.nome),
    dataNascimento: nascimento ? hubDateToIso(nascimento) : "",
    situacao: situacao || "Não informada pela API",
    endereco: mapEndereco(result),
  };
}

export function mapCnpjResult(
  digits: string,
  result: Record<string, unknown>
): CnpjResponse {
  const cnpjDigits = str(
    result.numero_de_inscricao || result.cnpj || digits
  ).replace(/\D/g, "");
  const abertura = str(result.abertura);
  const fantasia = str(result.fantasia);

  return {
    cnpj: formatCnpj(cnpjDigits || digits),
    razaoSocial: str(result.nome || result.nome_empresarial),
    nomeFantasia: fantasia || undefined,
    situacao: str(result.situacao) || "Não informada pela API",
    dataAbertura: abertura ? hubDateToIso(abertura) : undefined,
    endereco: mapEndereco(result),
  };
}

export function mapCepResult(
  digits: string,
  result: Record<string, unknown>
): CepResponse {
  const cepDigits = str(result.cep).replace(/\D/g, "") || digits;

  return {
    cep: formatCep(cepDigits),
    logradouro: str(result.logradouro),
    bairro: str(result.bairro),
    cidade: str(result.localidade || result.municipio || result.cidade),
    uf: str(result.uf),
  };
}
