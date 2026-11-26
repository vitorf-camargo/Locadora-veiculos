import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { categoriaService } from "../../service/categoriaService";
import { categoriaInicial, type Categoria } from "../../models/Categoria";

export function CategoriaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (id) {
      categoriaService.buscarPorId(id).then(setCategoria);
    }
  }, [id]);

  function salvar() {
    if (categoria.nome.trim() === "") {
      setErro("O nome da categoria e obrigatorio");
      return;
    }

    if (categoria.valorLocacao <= 0) {
      setErro("O valor da diaria deve ser maior que zero");
      return;
    }

    const operacao = id ? categoriaService.atualizar(id, categoria) : categoriaService.criar(categoria);

    operacao
      .then(() => navigate("/categorias"))
      .catch((error: Error) => setErro(error.message));
  }

  return (
    <div className="container">
      <h1>{id ? "Editar Categoria" : "Nova Categoria"}</h1>

      <Alert type="danger" message={erro} />

      <Input
        label="Nome"
        name="nome"
        value={categoria.nome}
        onChange={(valor) => setCategoria({ ...categoria, nome: valor })}
        placeholder="Nome da categoria"
      />

      <Input
        label="Valor da Diaria"
        name="valorLocacao"
        type="number"
        value={categoria.valorLocacao}
        onChange={(valor) => setCategoria({ ...categoria, valorLocacao: Number(valor) })}
        placeholder="0.00"
      />

      <Button label="Salvar" onClick={salvar} />
    </div>
  );
}
