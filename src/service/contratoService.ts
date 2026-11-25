import { api } from "./api";
import type { Contrato } from "../models/Contrato";

export const contratoService = {
  listar: async (): Promise<Contrato[]> => (await api.get<Contrato[]>("/contratos")).data,

  buscarPorId: async (id: string): Promise<Contrato> => (await api.get<Contrato>(`/contratos/${id}`)).data,

  buscarPorLocacao: async (locacaoId: string): Promise<Contrato | undefined> => {
    const resultado = (await api.get<Contrato[]>("/contratos", { params: { locacaoId } })).data;
    return resultado[0];
  },

  criar: async (contrato: Contrato): Promise<Contrato> =>
    (await api.post<Contrato>("/contratos", contrato)).data,

  atualizar: async (id: string, contrato: Contrato): Promise<Contrato> =>
    (await api.put<Contrato>(`/contratos/${id}`, contrato)).data,

  excluir: async (id: string): Promise<void> => {
    await api.delete(`/contratos/${id}`);
  },
};
