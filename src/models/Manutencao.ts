export interface Manutencao {
  id?: string;
  data: string;
  descricao: string;
  valor: number;
  veiculoId: string;
}

export const manutencaoInicial: Manutencao = {
  data: "",
  descricao: "",
  valor: 0,
  veiculoId: "",
};
