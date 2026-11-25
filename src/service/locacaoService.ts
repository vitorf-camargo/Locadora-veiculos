import { api } from "./api";
import type { Locacao, StatusLocacao } from "../models/Locacao";

export interface FiltroLocacao {
  status?: StatusLocacao;
  clienteId?: string;
}

export const locacaoService = {
  listar: async (filtro?: FiltroLocacao): Promise<Locacao[]> =>
    (await api.get<Locacao[]>("/locacoes", { params: filtro })).data,

  buscarPorId: async (id: string): Promise<Locacao> => (await api.get<Locacao>(`/locacoes/${id}`)).data,

  criar: async (locacao: Locacao): Promise<Locacao> => (await api.post<Locacao>("/locacoes", locacao)).data,

  atualizar: async (id: string, locacao: Locacao): Promise<Locacao> =>
    (await api.put<Locacao>(`/locacoes/${id}`, locacao)).data,

  excluir: async (id: string): Promise<void> => {
    await api.delete(`/locacoes/${id}`);
  },

  buscarAbertaPorVeiculo: async (veiculoId: string): Promise<Locacao | undefined> => {
    const resultado = (
      await api.get<Locacao[]>("/locacoes", { params: { veiculoId, status: "ABERTA" } })
    ).data;
    return resultado[0];
  },
};
