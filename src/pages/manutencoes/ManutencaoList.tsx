import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Alert } from "../../components/Alert";
import { Select } from "../../components/Select";
import { manutencaoService } from "../../service/manutencaoService";
import { veiculoService } from "../../service/veiculoService";
import type { Manutencao } from "../../models/Manutencao";
import type { Veiculo } from "../../models/Veiculo";

export function ManutencaoList() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [filtroVeiculoId, setFiltroVeiculoId] = useState("");
  const [manutencaoParaExcluir, setManutencaoParaExcluir] = useState<Manutencao | null>(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    veiculoService.listar().then(setVeiculos);
  }, []);

  useEffect(() => {
    carregar();
  }, [filtroVeiculoId]);

  function carregar() {
    if (filtroVeiculoId) {
      manutencaoService.listarPorVeiculo(filtroVeiculoId).then(setManutencoes);
    } else {
      manutencaoService.listar().then(setManutencoes);
    }
  }

  function identificacaoVeiculo(veiculoId: string): string {
    const veiculo = veiculos.find((v) => v.id === veiculoId);
    return veiculo ? `${veiculo.placa}` : "-";
  }

  function confirmarExclusao() {
    if (!manutencaoParaExcluir || !manutencaoParaExcluir.id) {
      return;
    }

    manutencaoService
      .excluir(manutencaoParaExcluir.id)
      .then(() => {
        setManutencaoParaExcluir(null);
        setErro("");
        carregar();
      })
      .catch((error: Error) => {
        setErro(error.message);
        setManutencaoParaExcluir(null);
      });
  }

  return (
    <div className="container">
      <h1>Manutencoes</h1>

      <Alert type="danger" message={erro} />

      <div className="row align-items-end mb-3">
        <div className="col-md-4">
          <Select
            label="Filtrar por veiculo"
            name="filtroVeiculo"
            value={filtroVeiculoId}
            options={veiculos.map((veiculo) => ({ value: veiculo.id ?? "", label: veiculo.placa }))}
            onChange={setFiltroVeiculoId}
          />
        </div>
        <div className="col-md-4">
          <Button label="Nova Manutencao" onClick={() => navigate("/manutencoes/novo")} />
        </div>
      </div>

      <Table<Manutencao>
        columns={[
          { titulo: "Veiculo", render: (manutencao) => identificacaoVeiculo(manutencao.veiculoId) },
          { titulo: "Data", render: (manutencao) => manutencao.data },
          { titulo: "Descricao", render: (manutencao) => manutencao.descricao },
          { titulo: "Valor", render: (manutencao) => `R$ ${manutencao.valor.toFixed(2)}` },
        ]}
        data={manutencoes}
        onEditar={(manutencao) => navigate(`/manutencoes/${manutencao.id}/editar`)}
        onExcluir={(manutencao) => setManutencaoParaExcluir(manutencao)}
      />

      <Modal
        show={manutencaoParaExcluir !== null}
        title="Excluir manutencao"
        onClose={() => setManutencaoParaExcluir(null)}
        onConfirm={confirmarExclusao}
      >
        Tem certeza que deseja excluir essa manutencao?
      </Modal>
    </div>
  );
}
