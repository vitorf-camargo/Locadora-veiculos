import { api } from "./api";
import type { Cliente } from "../models/Cliente";
import type { Locacao } from "../models/Locacao";

export const clienteService = {
  listar: async (): Promise<Cliente[]> => (await api.get<Cliente[]>("/clientes")).data,

  buscarPorId: async (id: string): Promise<Cliente> => (await api.get<Cliente>(`/clientes/${id}`)).data,

  criar: async (cliente: Cliente): Promise<Cliente> => (await api.post<Cliente>("/clientes", cliente)).data,

  atualizar: async (id: string, cliente: Cliente): Promise<Cliente> =>
    (await api.put<Cliente>(`/clientes/${id}`, cliente)).data,

  excluir: async (id: string): Promise<void> => {
    const locacoesVinculadas = (await api.get<Locacao[]>("/locacoes", { params: { clienteId: id } })).data;
    if (locacoesVinculadas.length > 0) {
      throw new Error("Nao e possivel excluir esse cliente, existem locacoes vinculadas a ele.");
    }
    await api.delete(`/clientes/${id}`);
  },
};
