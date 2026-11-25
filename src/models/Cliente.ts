export interface Cliente {
  id?: string;
  nome: string;
  cpf: string;
  cnh: string;
  validadeCnh: string;
  telefone: string;
  email: string;
  endereco: string;
}

export const clienteInicial: Cliente = {
  nome: "",
  cpf: "",
  cnh: "",
  validadeCnh: "",
  telefone: "",
  email: "",
  endereco: "",
};

export function cnhVencida(cliente: Cliente): boolean {
  if (!cliente.validadeCnh) return false;
  const hoje = new Date();
  const validade = new Date(cliente.validadeCnh);
  return validade < hoje;
}
