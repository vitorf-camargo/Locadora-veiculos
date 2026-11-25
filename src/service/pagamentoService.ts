import { api } from "./api";
import type { Pagamento } from "../models/Pagamento";

export const pagamentoService = {
  listar: async (): Promise<Pagamento[]> => (await api.get<Pagamento[]>("/pagamentos")).data,

  listarPorLocacao: async (locacaoId: string): Promise<Pagamento[]> =>
    (await api.get<Pagamento[]>("/pagamentos", { params: { locacaoId } })).data,

  buscarPorId: async (id: string): Promise<Pagamento> => (await api.get<Pagamento>(`/pagamentos/${id}`)).data,

  criar: async (pagamento: Pagamento): Promise<Pagamento> =>
    (await api.post<Pagamento>("/pagamentos", pagamento)).data,

  atualizar: async (id: string, pagamento: Pagamento): Promise<Pagamento> =>
    (await api.put<Pagamento>(`/pagamentos/${id}`, pagamento)).data,

  excluir: async (id: string): Promise<void> => {
    await api.delete(`/pagamentos/${id}`);
  },
};
