export interface EnderecoHub {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface CpfResponse {
  cpf: string;
  nome: string;
  dataNascimento: string;
  situacao: string;
  endereco?: EnderecoHub;
}

export interface CnpjResponse {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  situacao: string;
  dataAbertura?: string;
  endereco?: EnderecoHub;
}

export interface CepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}
