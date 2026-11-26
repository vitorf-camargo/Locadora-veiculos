import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { Input } from "../../components/Input";
import { Alert } from "../../components/Alert";
import { locacaoService } from "../../service/locacaoService";
import { clienteService } from "../../service/clienteService";
import { veiculoService } from "../../service/veiculoService";
import { contratoService } from "../../service/contratoService";
import { vistoriaService } from "../../service/vistoriaService";
import { pagamentoService } from "../../service/pagamentoService";
import { notaFiscalService } from "../../service/notaFiscalService";
import { gerarNumeroNotaFiscal } from "../../models/NotaFiscal";
import type { Locacao } from "../../models/Locacao";
import type { Cliente } from "../../models/Cliente";
import type { Veiculo } from "../../models/Veiculo";
import type { Contrato } from "../../models/Contrato";
import type { Vistoria } from "../../models/Vistoria";
import { pagamentoInicial, type FormaPagamento, type Pagamento, type StatusPagamento } from "../../models/Pagamento";
import type { NotaFiscal } from "../../models/NotaFiscal";

export function LocacaoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [locacao, setLocacao] = useState<Locacao | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [vistorias, setVistorias] = useState<Vistoria[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [notaFiscal, setNotaFiscal] = useState<NotaFiscal | null>(null);

  const [novoPagamento, setNovoPagamento] = useState<Pagamento>(pagamentoInicial);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (id) {
      carregar(id);
    }
  }, [id]);

  function carregar(locacaoId: string) {
    locacaoService.buscarPorId(locacaoId).then((loc) => {
      setLocacao(loc);
      clienteService.buscarPorId(loc.clienteId).then(setCliente);
      veiculoService.buscarPorId(loc.veiculoId).then(setVeiculo);
    });
    contratoService.buscarPorLocacao(locacaoId).then((c) => setContrato(c ?? null));
    vistoriaService.listarPorLocacao(locacaoId).then(setVistorias);
    pagamentoService.listarPorLocacao(locacaoId).then(setPagamentos);
    notaFiscalService.buscarPorLocacao(locacaoId).then((nf) => setNotaFiscal(nf ?? null));
  }

  function registrarPagamento() {
    if (!id) return;

    if (novoPagamento.valor <= 0) {
      setErro("Informe um valor de pagamento maior que zero");
      return;
    }

    pagamentoService
      .criar({ ...novoPagamento, locacaoId: id, data: new Date().toISOString().slice(0, 10) })
      .then(() => {
        setNovoPagamento(pagamentoInicial);
        setErro("");
        carregar(id);
      })
      .catch((error: Error) => setErro(error.message));
  }

  function emitirNotaFiscal() {
    if (!id || !locacao) return;

    notaFiscalService
      .criar({
        numero: gerarNumeroNotaFiscal(),
        serie: "1",
        dataEmissao: new Date().toISOString().slice(0, 10),
        valor: locacao.valorTotal,
        locacaoId: id,
      })
      .then(() => carregar(id))
      .catch((error: Error) => setErro(error.message));
  }

  if (!locacao) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div className="container">
      <h1>Locacao #{locacao.id}</h1>

      <Alert type="danger" message={erro} />

      <Card title="Dados Gerais">
        <p>Cliente: {cliente?.nome}</p>
        <p>Veiculo: {veiculo?.placa}</p>
        <p>Data de Retirada: {locacao.dataRetirada}</p>
        <p>Data de Devolucao Prevista: {locacao.dataDevolucaoPrevista}</p>
        {locacao.dataDevolucaoReal && <p>Data de Devolucao Real: {locacao.dataDevolucaoReal}</p>}
        <p>Valor Total: R$ {locacao.valorTotal.toFixed(2)}</p>
        <p>Status: {locacao.status}</p>

        {locacao.status === "ABERTA" && (
          <Button label="Registrar Devolucao" onClick={() => navigate(`/locacoes/${id}/devolucao`)} />
        )}
      </Card>

      <Card title="Contrato">
        {contrato ? (
          <>
            <p>Numero: {contrato.numero}</p>
            <p>Data de Emissao: {contrato.dataEmissao}</p>
          </>
        ) : (
          <p>Nenhum contrato encontrado.</p>
        )}
      </Card>

      <Card title="Vistorias">
        <Table<Vistoria>
          columns={[
            { titulo: "Tipo", render: (vistoria) => vistoria.tipo },
            { titulo: "Data", render: (vistoria) => vistoria.data },
            { titulo: "Km", render: (vistoria) => vistoria.km },
            { titulo: "Combustivel", render: (vistoria) => vistoria.nivelCombustivel },
            { titulo: "Observacoes", render: (vistoria) => vistoria.observacoes },
          ]}
          data={vistorias}
        />
      </Card>

      <Card title="Pagamentos">
        <Table<Pagamento>
          columns={[
            { titulo: "Data", render: (pagamento) => pagamento.data },
            { titulo: "Valor", render: (pagamento) => `R$ ${pagamento.valor.toFixed(2)}` },
            { titulo: "Forma", render: (pagamento) => pagamento.forma },
            { titulo: "Status", render: (pagamento) => pagamento.status },
          ]}
          data={pagamentos}
        />

        <h3>Registrar Pagamento</h3>

        <Input
          label="Valor"
          name="valorPagamento"
          type="number"
          value={novoPagamento.valor}
          onChange={(valor) => setNovoPagamento({ ...novoPagamento, valor: Number(valor) })}
        />

        <Select
          label="Forma de Pagamento"
          name="forma"
          value={novoPagamento.forma}
          options={[
            { value: "DINHEIRO", label: "Dinheiro" },
            { value: "CARTAO", label: "Cartao" },
            { value: "PIX", label: "Pix" },
            { value: "TRANSFERENCIA", label: "Transferencia" },
          ]}
          onChange={(valor) => setNovoPagamento({ ...novoPagamento, forma: valor as FormaPagamento })}
        />

        <Select
          label="Status"
          name="statusPagamento"
          value={novoPagamento.status}
          options={[
            { value: "PENDENTE", label: "Pendente" },
            { value: "PAGO", label: "Pago" },
            { value: "CANCELADO", label: "Cancelado" },
          ]}
          onChange={(valor) => setNovoPagamento({ ...novoPagamento, status: valor as StatusPagamento })}
        />

        <Button label="Registrar Pagamento" onClick={registrarPagamento} />
      </Card>

      <Card title="Nota Fiscal">
        {notaFiscal ? (
          <>
            <p>Numero: {notaFiscal.numero}</p>
            <p>Data de Emissao: {notaFiscal.dataEmissao}</p>
            <p>Valor: R$ {notaFiscal.valor.toFixed(2)}</p>
          </>
        ) : locacao.status === "FINALIZADA" ? (
          <Button label="Emitir Nota Fiscal" onClick={emitirNotaFiscal} />
        ) : (
          <p>A nota fiscal so pode ser emitida apos a locacao ser finalizada.</p>
        )}
      </Card>
    </div>
  );
}
