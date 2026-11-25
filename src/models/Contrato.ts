export interface Contrato {
  id?: string;
  numero: string;
  dataEmissao: string;
  termos: string;
  locacaoId: string;
}

export const contratoInicial: Contrato = {
  numero: "",
  dataEmissao: "",
  termos: "",
  locacaoId: "",
};

export function gerarNumeroContrato(): string {
  const agora = Date.now();
  return `CT-${agora}`;
}
