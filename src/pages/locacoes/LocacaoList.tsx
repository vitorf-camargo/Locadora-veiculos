import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { locacaoService } from "../../service/locacaoService";
import { clienteService } from "../../service/clienteService";
import { veiculoService } from "../../service/veiculoService";
import type { Locacao, StatusLocacao } from "../../models/Locacao";
import type { Cliente } from "../../models/Cliente";
import type { Veiculo } from "../../models/Veiculo";

export function LocacaoList() {
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>("");
  const [filtroClienteId, setFiltroClienteId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    clienteService.listar().then(setClientes);
    veiculoService.listar().then(setVeiculos);
  }, []);

  useEffect(() => {
    carregar();
  }, [filtroStatus, filtroClienteId]);

  function carregar() {
    locacaoService
      .listar({
        status: filtroStatus ? (filtroStatus as StatusLocacao) : undefined,
        clienteId: filtroClienteId || undefined,
      })
      .then(setLocacoes);
  }

  function nomeCliente(clienteId: string): string {
    return clientes.find((cliente) => cliente.id === clienteId)?.nome ?? "-";
  }

  function placaVeiculo(veiculoId: string): string {
    return veiculos.find((veiculo) => veiculo.id === veiculoId)?.placa ?? "-";
  }

  return (
    <div className="container">
      <h1>Locacoes</h1>

      <div className="mb-3">
        <Button label="Nova Locacao" onClick={() => navigate("/locacoes/novo")} />
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <Select
            label="Filtrar por status"
            name="filtroStatus"
            value={filtroStatus}
            options={[
              { value: "ABERTA", label: "Aberta" },
              { value: "FINALIZADA", label: "Finalizada" },
              { value: "CANCELADA", label: "Cancelada" },
            ]}
            onChange={setFiltroStatus}
          />
        </div>
        <div className="col-md-4">
          <Select
            label="Filtrar por cliente"
            name="filtroCliente"
            value={filtroClienteId}
            options={clientes.map((cliente) => ({ value: cliente.id ?? "", label: cliente.nome }))}
            onChange={setFiltroClienteId}
          />
        </div>
      </div>

      <Table<Locacao>
        columns={[
          { titulo: "Cliente", render: (locacao) => nomeCliente(locacao.clienteId) },
          { titulo: "Veiculo", render: (locacao) => placaVeiculo(locacao.veiculoId) },
          { titulo: "Retirada", render: (locacao) => locacao.dataRetirada },
          { titulo: "Devolucao Prevista", render: (locacao) => locacao.dataDevolucaoPrevista },
          { titulo: "Valor", render: (locacao) => `R$ ${locacao.valorTotal.toFixed(2)}` },
          { titulo: "Status", render: (locacao) => locacao.status },
          {
            titulo: "Detalhe",
            render: (locacao) => (
              <Button label="Ver" variant="secondary" onClick={() => navigate(`/locacoes/${locacao.id}`)} />
            ),
          },
        ]}
        data={locacoes}
      />
    </div>
  );
}
