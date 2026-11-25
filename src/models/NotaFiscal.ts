export interface NotaFiscal {
  id?: string;
  numero: string;
  serie: string;
  dataEmissao: string;
  valor: number;
  locacaoId: string;
}

export const notaFiscalInicial: NotaFiscal = {
  numero: "",
  serie: "1",
  dataEmissao: "",
  valor: 0,
  locacaoId: "",
};

export function gerarNumeroNotaFiscal(): string {
  const agora = Date.now();
  return `NF-${agora}`;
}
