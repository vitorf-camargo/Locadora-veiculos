export type TipoVistoria = "RETIRADA" | "DEVOLUCAO";

export interface Vistoria {
  id?: string;
  tipo: TipoVistoria;
  data: string;
  km: number;
  nivelCombustivel: string;
  observacoes: string;
  locacaoId: string;
}

export const vistoriaInicial: Vistoria = {
  tipo: "RETIRADA",
  data: "",
  km: 0,
  nivelCombustivel: "",
  observacoes: "",
  locacaoId: "",
};
