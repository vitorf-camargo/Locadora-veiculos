import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { modeloService } from "../../service/modeloService";
import { marcaService } from "../../service/marcaService";
import { categoriaService } from "../../service/categoriaService";
import { modeloInicial, type Modelo } from "../../models/Modelo";
import type { Marca } from "../../models/Marca";
import type { Categoria } from "../../models/Categoria";

export function ModeloForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modelo, setModelo] = useState<Modelo>(modeloInicial);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    marcaService.listar().then(setMarcas);
    categoriaService.listar().then(setCategorias);
    if (id) {
      modeloService.buscarPorId(id).then(setModelo);
    }
  }, [id]);

  function salvar() {
    if (modelo.nome.trim() === "") {
      setErro("O nome do modelo e obrigatorio");
      return;
    }

    if (modelo.marcaId === "" || modelo.categoriaId === "") {
      setErro("Selecione a marca e a categoria");
      return;
    }

    const operacao = id ? modeloService.atualizar(id, modelo) : modeloService.criar(modelo);

    operacao
      .then(() => navigate("/modelos"))
      .catch((error: Error) => setErro(error.message));
  }

  return (
    <div className="container">
      <h1>{id ? "Editar Modelo" : "Novo Modelo"}</h1>

      <Alert type="danger" message={erro} />

      <Input
        label="Nome"
        name="nome"
        value={modelo.nome}
        onChange={(valor) => setModelo({ ...modelo, nome: valor })}
        placeholder="Nome do modelo"
      />

      <Input
        label="Ano"
        name="ano"
        type="number"
        value={modelo.ano}
        onChange={(valor) => setModelo({ ...modelo, ano: Number(valor) })}
      />

      <Select
        label="Marca"
        name="marcaId"
        value={modelo.marcaId}
        options={marcas.map((marca) => ({ value: marca.id ?? "", label: marca.nome }))}
        onChange={(valor) => setModelo({ ...modelo, marcaId: valor })}
      />

      <Select
        label="Categoria"
        name="categoriaId"
        value={modelo.categoriaId}
        options={categorias.map((categoria) => ({ value: categoria.id ?? "", label: categoria.nome }))}
        onChange={(valor) => setModelo({ ...modelo, categoriaId: valor })}
      />

      <Button label="Salvar" onClick={salvar} />
    </div>
  );
}
