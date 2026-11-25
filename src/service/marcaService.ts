import { api } from "./api";
import type { Marca } from "../models/Marca";
import type { Modelo } from "../models/Modelo";

export const marcaService = {
  listar: async (): Promise<Marca[]> => (await api.get<Marca[]>("/marcas")).data,

  buscarPorId: async (id: string): Promise<Marca> => (await api.get<Marca>(`/marcas/${id}`)).data,

  criar: async (marca: Marca): Promise<Marca> => (await api.post<Marca>("/marcas", marca)).data,

  atualizar: async (id: string, marca: Marca): Promise<Marca> =>
    (await api.put<Marca>(`/marcas/${id}`, marca)).data,

  excluir: async (id: string): Promise<void> => {
    const modelosVinculados = (await api.get<Modelo[]>("/modelos", { params: { marcaId: id } })).data;
    if (modelosVinculados.length > 0) {
      throw new Error("Nao e possivel excluir essa marca, existem modelos vinculados a ela.");
    }
    await api.delete(`/marcas/${id}`);
  },
};
