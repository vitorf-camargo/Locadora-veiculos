export type StatusLocacao = "ABERTA" | "FINALIZADA" | "CANCELADA";

export interface Locacao {
  id?: string;
  dataRetirada: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
  kmRetirada: number;
  kmDevolucao?: number;
  valorTotal: number;
  status: StatusLocacao;
  clienteId: string;
  veiculoId: string;
}

export const locacaoInicial: Locacao = {
  dataRetirada: "",
  dataDevolucaoPrevista: "",
  kmRetirada: 0,
  valorTotal: 0,
  status: "ABERTA",
  clienteId: "",
  veiculoId: "",
};

export function calcularNumeroDiarias(dataRetirada: string, dataDevolucao: string): number {
  const inicio = new Date(dataRetirada);
  const fim = new Date(dataDevolucao);
  const diffMs = fim.getTime() - inicio.getTime();
  const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return dias > 0 ? dias : 1;
}

export function calcularValorLocacao(dataRetirada: string, dataDevolucao: string, valorDiaria: number): number {
  const diarias = calcularNumeroDiarias(dataRetirada, dataDevolucao);
  return diarias * valorDiaria;
}
