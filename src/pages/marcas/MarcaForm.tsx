import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { marcaService } from "../../service/marcaService";
import { marcaInicial, type Marca } from "../../models/Marca";

export function MarcaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marca, setMarca] = useState<Marca>(marcaInicial);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (id) {
      marcaService.buscarPorId(id).then(setMarca);
    }
  }, [id]);

  function salvar() {
    if (marca.nome.trim() === "") {
      setErro("O nome da marca e obrigatorio");
      return;
    }

    const operacao = id ? marcaService.atualizar(id, marca) : marcaService.criar(marca);

    operacao
      .then(() => navigate("/marcas"))
      .catch((error: Error) => setErro(error.message));
  }

  return (
    <div className="container">
      <h1>{id ? "Editar Marca" : "Nova Marca"}</h1>

      <Alert type="danger" message={erro} />

      <Input
        label="Nome"
        name="nome"
        value={marca.nome}
        onChange={(valor) => setMarca({ ...marca, nome: valor })}
        placeholder="Nome da marca"
      />

      <Button label="Salvar" onClick={salvar} />
    </div>
  );
}
