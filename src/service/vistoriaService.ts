import { api } from "./api";
import type { Vistoria } from "../models/Vistoria";

export const vistoriaService = {
  listar: async (): Promise<Vistoria[]> => (await api.get<Vistoria[]>("/vistorias")).data,

  listarPorLocacao: async (locacaoId: string): Promise<Vistoria[]> =>
    (await api.get<Vistoria[]>("/vistorias", { params: { locacaoId } })).data,

  buscarPorId: async (id: string): Promise<Vistoria> => (await api.get<Vistoria>(`/vistorias/${id}`)).data,

  criar: async (vistoria: Vistoria): Promise<Vistoria> =>
    (await api.post<Vistoria>("/vistorias", vistoria)).data,

  atualizar: async (id: string, vistoria: Vistoria): Promise<Vistoria> =>
    (await api.put<Vistoria>(`/vistorias/${id}`, vistoria)).data,

  excluir: async (id: string): Promise<void> => {
    await api.delete(`/vistorias/${id}`);
  },
};
