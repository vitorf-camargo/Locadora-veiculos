import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { veiculoService } from "../../service/veiculoService";
import { modeloService } from "../../service/modeloService";
import { veiculoInicial, type Veiculo } from "../../models/Veiculo";
import type { Modelo } from "../../models/Modelo";

export function VeiculoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [veiculo, setVeiculo] = useState<Veiculo>(veiculoInicial);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [todosVeiculos, setTodosVeiculos] = useState<Veiculo[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    modeloService.listar().then(setModelos);
    veiculoService.listar().then(setTodosVeiculos);
    if (id) {
      veiculoService.buscarPorId(id).then(setVeiculo);
    }
  }, [id]);

  function salvar() {
    if (veiculo.placa.trim() === "" || veiculo.chassi.trim() === "") {
      setErro("Placa e chassi sao obrigatorios");
      return;
    }

    if (veiculo.modeloId === "") {
      setErro("Selecione o modelo");
      return;
    }

    const placaDuplicada = todosVeiculos.some(
      (outro) => outro.id !== id && outro.placa.toUpperCase() === veiculo.placa.toUpperCase(),
    );
    const chassiDuplicado = todosVeiculos.some(
      (outro) => outro.id !== id && outro.chassi.toUpperCase() === veiculo.chassi.toUpperCase(),
    );

    if (placaDuplicada) {
      setErro("Ja existe um veiculo cadastrado com essa placa");
      return;
    }

    if (chassiDuplicado) {
      setErro("Ja existe um veiculo cadastrado com esse chassi");
      return;
    }

    const operacao = id ? veiculoService.atualizar(id, veiculo) : veiculoService.criar(veiculo);

    operacao
      .then(() => navigate("/veiculos"))
      .catch((error: Error) => setErro(error.message));
  }

  return (
    <div className="container">
      <h1>{id ? "Editar Veiculo" : "Novo Veiculo"}</h1>

      <Alert type="danger" message={erro} />

      <Select
        label="Modelo"
        name="modeloId"
        value={veiculo.modeloId}
        options={modelos.map((modelo) => ({ value: modelo.id ?? "", label: `${modelo.nome} (${modelo.ano})` }))}
        onChange={(valor) => setVeiculo({ ...veiculo, modeloId: valor })}
      />

      <Input
        label="Placa"
        name="placa"
        value={veiculo.placa}
        onChange={(valor) => setVeiculo({ ...veiculo, placa: valor })}
        placeholder="ABC1D23"
      />

      <Input
        label="Chassi"
        name="chassi"
        value={veiculo.chassi}
        onChange={(valor) => setVeiculo({ ...veiculo, chassi: valor })}
        placeholder="9BWZZZ377VT004251"
      />

      <Input
        label="Ano de Fabricacao"
        name="anoFabricacao"
        type="number"
        value={veiculo.anoFabricacao}
        onChange={(valor) => setVeiculo({ ...veiculo, anoFabricacao: Number(valor) })}
      />

      <Input
        label="Cor"
        name="cor"
        value={veiculo.cor}
        onChange={(valor) => setVeiculo({ ...veiculo, cor: valor })}
      />

      <Input
        label="Km Rodado"
        name="kmRodado"
        type="number"
        value={veiculo.kmRodado}
        onChange={(valor) => setVeiculo({ ...veiculo, kmRodado: Number(valor) })}
      />

      <Button label="Salvar" onClick={salvar} />
    </div>
  );
}
