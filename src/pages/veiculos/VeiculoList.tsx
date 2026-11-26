import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Alert } from "../../components/Alert";
import { veiculoService } from "../../service/veiculoService";
import { modeloService } from "../../service/modeloService";
import { locacaoService } from "../../service/locacaoService";
import type { Veiculo } from "../../models/Veiculo";
import type { Modelo } from "../../models/Modelo";

export function VeiculoList() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [veiculosLocados, setVeiculosLocados] = useState<Set<string>>(new Set());
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState<Veiculo | null>(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
    modeloService.listar().then(setModelos);
  }, []);

  function carregar() {
    veiculoService.listar().then(setVeiculos);
    locacaoService.listar({ status: "ABERTA" }).then((locacoesAbertas) => {
      setVeiculosLocados(new Set(locacoesAbertas.map((locacao) => locacao.veiculoId)));
    });
  }

  function nomeModelo(modeloId: string): string {
    return modelos.find((modelo) => modelo.id === modeloId)?.nome ?? "-";
  }

  function statusVeiculo(veiculo: Veiculo): string {
    return veiculosLocados.has(veiculo.id ?? "") ? "Locado" : "Disponivel";
  }

  function confirmarExclusao() {
    if (!veiculoParaExcluir || !veiculoParaExcluir.id) {
      return;
    }

    veiculoService
      .excluir(veiculoParaExcluir.id)
      .then(() => {
        setVeiculoParaExcluir(null);
        setErro("");
        carregar();
      })
      .catch((error: Error) => {
        setErro(error.message);
        setVeiculoParaExcluir(null);
      });
  }

  return (
    <div className="container">
      <h1>Veiculos</h1>

      <Alert type="danger" message={erro} />

      <div className="mb-3">
        <Button label="Novo Veiculo" onClick={() => navigate("/veiculos/novo")} />
      </div>

      <Table<Veiculo>
        columns={[
          { titulo: "Placa", render: (veiculo) => veiculo.placa },
          { titulo: "Chassi", render: (veiculo) => veiculo.chassi },
          { titulo: "Modelo", render: (veiculo) => nomeModelo(veiculo.modeloId) },
          { titulo: "Cor", render: (veiculo) => veiculo.cor },
          { titulo: "Km Rodado", render: (veiculo) => veiculo.kmRodado },
          { titulo: "Status", render: (veiculo) => statusVeiculo(veiculo) },
        ]}
        data={veiculos}
        onEditar={(veiculo) => navigate(`/veiculos/${veiculo.id}/editar`)}
        onExcluir={(veiculo) => setVeiculoParaExcluir(veiculo)}
      />

      <Modal
        show={veiculoParaExcluir !== null}
        title="Excluir veiculo"
        onClose={() => setVeiculoParaExcluir(null)}
        onConfirm={confirmarExclusao}
      >
        Tem certeza que deseja excluir o veiculo placa "{veiculoParaExcluir?.placa}"?
      </Modal>
    </div>
  );
}
