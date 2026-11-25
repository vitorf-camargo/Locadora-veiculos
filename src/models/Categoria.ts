export interface Categoria {
  id?: string;
  nome: string;
  valorLocacao: number;
}

export const categoriaInicial: Categoria = {
  nome: "",
  valorLocacao: 0,
};
