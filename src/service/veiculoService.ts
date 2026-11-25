import { api } from "./api";
import type { Veiculo } from "../models/Veiculo";
import type { Manutencao } from "../models/Manutencao";
import type { Locacao } from "../models/Locacao";

export const veiculoService = {
  listar: async (): Promise<Veiculo[]> => (await api.get<Veiculo[]>("/veiculos")).data,

  buscarPorId: async (id: string): Promise<Veiculo> => (await api.get<Veiculo>(`/veiculos/${id}`)).data,

  criar: async (veiculo: Veiculo): Promise<Veiculo> => (await api.post<Veiculo>("/veiculos", veiculo)).data,

  atualizar: async (id: string, veiculo: Veiculo): Promise<Veiculo> =>
    (await api.put<Veiculo>(`/veiculos/${id}`, veiculo)).data,

  excluir: async (id: string): Promise<void> => {
    const manutencoesVinculadas = (await api.get<Manutencao[]>("/manutencoes", { params: { veiculoId: id } })).data;
    const locacoesVinculadas = (await api.get<Locacao[]>("/locacoes", { params: { veiculoId: id } })).data;
    if (manutencoesVinculadas.length > 0 || locacoesVinculadas.length > 0) {
      throw new Error("Nao e possivel excluir esse veiculo, existem manutencoes ou locacoes vinculadas a ele.");
    }
    await api.delete(`/veiculos/${id}`);
  },

  possuiLocacaoAberta: async (id: string): Promise<boolean> => {
    const locacoesAbertas = (
      await api.get<Locacao[]>("/locacoes", { params: { veiculoId: id, status: "ABERTA" } })
    ).data;
    return locacoesAbertas.length > 0;
  },
};
