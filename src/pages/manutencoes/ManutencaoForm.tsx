import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { manutencaoService } from "../../service/manutencaoService";
import { veiculoService } from "../../service/veiculoService";
import { manutencaoInicial, type Manutencao } from "../../models/Manutencao";
import type { Veiculo } from "../../models/Veiculo";

export function ManutencaoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manutencao, setManutencao] = useState<Manutencao>(manutencaoInicial);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    veiculoService.listar().then(setVeiculos);
    if (id) {
      manutencaoService.buscarPorId(id).then(setManutencao);
    }
  }, [id]);

  function salvar() {
    if (manutencao.veiculoId === "") {
      setErro("Selecione o veiculo");
      return;
    }

    if (manutencao.data === "") {
      setErro("Informe a data da manutencao");
      return;
    }

    const operacao = id ? manutencaoService.atualizar(id, manutencao) : manutencaoService.criar(manutencao);

    operacao
      .then(() => navigate("/manutencoes"))
      .catch((error: Error) => setErro(error.message));
  }

  return (
    <div className="container">
      <h1>{id ? "Editar Manutencao" : "Nova Manutencao"}</h1>

      <Alert type="danger" message={erro} />

      <Select
        label="Veiculo"
        name="veiculoId"
        value={manutencao.veiculoId}
        options={veiculos.map((veiculo) => ({ value: veiculo.id ?? "", label: veiculo.placa }))}
        onChange={(valor) => setManutencao({ ...manutencao, veiculoId: valor })}
      />

      <Input
        label="Data"
        name="data"
        type="date"
        value={manutencao.data}
        onChange={(valor) => setManutencao({ ...manutencao, data: valor })}
      />

      <TextArea
        label="Descricao"
        name="descricao"
        value={manutencao.descricao}
        onChange={(valor) => setManutencao({ ...manutencao, descricao: valor })}
      />

      <Input
        label="Valor"
        name="valor"
        type="number"
        value={manutencao.valor}
        onChange={(valor) => setManutencao({ ...manutencao, valor: Number(valor) })}
      />

      <Button label="Salvar" onClick={salvar} />
    </div>
  );
}
