import { api } from "./api";
import type { Modelo } from "../models/Modelo";
import type { Veiculo } from "../models/Veiculo";

export const modeloService = {
  listar: async (): Promise<Modelo[]> => (await api.get<Modelo[]>("/modelos")).data,

  buscarPorId: async (id: string): Promise<Modelo> => (await api.get<Modelo>(`/modelos/${id}`)).data,

  criar: async (modelo: Modelo): Promise<Modelo> => (await api.post<Modelo>("/modelos", modelo)).data,

  atualizar: async (id: string, modelo: Modelo): Promise<Modelo> =>
    (await api.put<Modelo>(`/modelos/${id}`, modelo)).data,

  excluir: async (id: string): Promise<void> => {
    const veiculosVinculados = (await api.get<Veiculo[]>("/veiculos", { params: { modeloId: id } })).data;
    if (veiculosVinculados.length > 0) {
      throw new Error("Nao e possivel excluir esse modelo, existem veiculos vinculados a ele.");
    }
    await api.delete(`/modelos/${id}`);
  },
};
