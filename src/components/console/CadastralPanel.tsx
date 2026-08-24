import { Panel, MonoField } from "@/components/ui/Panel";
import type { CnpjData, CpfData } from "@/types";

export function CadastralPanel({
  cadastral,
}: {
  cadastral: CpfData | CnpjData | null | undefined;
}) {
  if (!cadastral) {
    return (
      <Panel title="Dados cadastrais">
        <p className="text-sm text-slate">Aguardando consulta ao cadastro.</p>
      </Panel>
    );
  }

  if ("nome" in cadastral) {
    return (
      <Panel title="Dados cadastrais">
        <dl className="grid gap-3 sm:grid-cols-2">
          <MonoField label="CPF" value={cadastral.cpf} />
          <MonoField label="Situação" value={cadastral.situacao} />
          <MonoField label="Nome" value={cadastral.nome} />
          <MonoField label="Nascimento" value={cadastral.dataNascimento} />
          {cadastral.endereco && (
            <>
              <MonoField
                label="Endereço"
                value={`${cadastral.endereco.logradouro}, ${cadastral.endereco.numero}`}
              />
              <MonoField label="CEP" value={cadastral.endereco.cep} />
            </>
          )}
        </dl>
      </Panel>
    );
  }

  return (
    <Panel title="Dados cadastrais">
      <dl className="grid gap-3 sm:grid-cols-2">
        <MonoField label="CNPJ" value={cadastral.cnpj} />
        <MonoField label="Situação" value={cadastral.situacao} />
        <MonoField label="Razão social" value={cadastral.razaoSocial} />
        <MonoField label="Nome fantasia" value={cadastral.nomeFantasia} />
        {cadastral.dataAbertura && (
          <MonoField label="Abertura" value={cadastral.dataAbertura} />
        )}
        {cadastral.endereco && (
          <>
            <MonoField
              label="Endereço"
              value={`${cadastral.endereco.logradouro}, ${cadastral.endereco.numero}`}
            />
            <MonoField label="CEP" value={cadastral.endereco.cep} />
          </>
        )}
      </dl>
    </Panel>
  );
}
