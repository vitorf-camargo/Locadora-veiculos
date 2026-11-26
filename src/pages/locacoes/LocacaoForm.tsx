import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { locacaoService } from "../../service/locacaoService";
import { contratoService } from "../../service/contratoService";
import { vistoriaService } from "../../service/vistoriaService";
import { veiculoService } from "../../service/veiculoService";
import { clienteService } from "../../service/clienteService";
import { modeloService } from "../../service/modeloService";
import { categoriaService } from "../../service/categoriaService";
import { calcularValorLocacao } from "../../models/Locacao";
import { gerarNumeroContrato } from "../../models/Contrato";
import { cnhVencida, type Cliente } from "../../models/Cliente";
import type { Veiculo } from "../../models/Veiculo";
import type { Modelo } from "../../models/Modelo";
import type { Categoria } from "../../models/Categoria";

export function LocacaoForm() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [veiculosDisponiveisIds, setVeiculosDisponiveisIds] = useState<Set<string>>(new Set());

  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [dataRetirada, setDataRetirada] = useState("");
  const [dataDevolucaoPrevista, setDataDevolucaoPrevista] = useState("");
  const [kmRetirada, setKmRetirada] = useState(0);
  const [nivelCombustivel, setNivelCombustivel] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [erro, setErro] = useState("");

  useEffect(() => {
    clienteService.listar().then(setClientes);
    veiculoService.listar().then(setVeiculos);
    modeloService.listar().then(setModelos);
    categoriaService.listar().then(setCategorias);

    locacaoService.listar({ status: "ABERTA" }).then((abertas) => {
      const locadosIds = new Set(abertas.map((locacao) => locacao.veiculoId));
      veiculoService.listar().then((todos) => {
        setVeiculosDisponiveisIds(new Set(todos.filter((v) => !locadosIds.has(v.id ?? "")).map((v) => v.id ?? "")));
      });
    });
  }, []);

  function valorDiariaDoVeiculo(idVeiculo: string): number {
    const veiculo = veiculos.find((v) => v.id === idVeiculo);
    if (!veiculo) return 0;
    const modelo = modelos.find((m) => m.id === veiculo.modeloId);
    if (!modelo) return 0;
    const categoria = categorias.find((c) => c.id === modelo.categoriaId);
    return categoria?.valorLocacao ?? 0;
  }

  async function registrar() {
    if (!clienteId || !veiculoId || !dataRetirada || !dataDevolucaoPrevista) {
      setErro("Preencha cliente, veiculo e as duas datas");
      return;
    }

    const cliente = clientes.find((c) => c.id === clienteId);
    if (cliente && cnhVencida(cliente)) {
      setErro("Nao e possivel registrar locacao: a CNH do cliente esta vencida");
      return;
    }

    if (new Date(dataDevolucaoPrevista) <= new Date(dataRetirada)) {
      setErro("A data de devolucao prevista deve ser posterior a data de retirada");
      return;
    }

    const aindaDisponivel = !(await veiculoService.possuiLocacaoAberta(veiculoId));
    if (!aindaDisponivel) {
      setErro("Esse veiculo ja possui uma locacao em aberto");
      return;
    }

    const valorDiaria = valorDiariaDoVeiculo(veiculoId);
    const valorTotal = calcularValorLocacao(dataRetirada, dataDevolucaoPrevista, valorDiaria);

    try {
      const locacaoCriada = await locacaoService.criar({
        dataRetirada,
        dataDevolucaoPrevista,
        kmRetirada,
        valorTotal,
        status: "ABERTA",
        clienteId,
        veiculoId,
      });

      await contratoService.criar({
        numero: gerarNumeroContrato(),
        dataEmissao: new Date().toISOString().slice(0, 10),
        termos: "Contrato de locacao gerado automaticamente ao registrar a locacao.",
        locacaoId: locacaoCriada.id ?? "",
      });

      await vistoriaService.criar({
        tipo: "RETIRADA",
        data: new Date().toISOString().slice(0, 10),
        km: kmRetirada,
        nivelCombustivel,
        observacoes,
        locacaoId: locacaoCriada.id ?? "",
      });

      navigate("/locacoes");
    } catch (error) {
      setErro((error as Error).message);
    }
  }

  return (
    <div className="container">
      <h1>Nova Locacao</h1>

      <Alert type="danger" message={erro} />

      <Select
        label="Cliente"
        name="clienteId"
        value={clienteId}
        options={clientes.map((cliente) => ({
          value: cliente.id ?? "",
          label: cnhVencida(cliente) ? `${cliente.nome} (CNH vencida)` : cliente.nome,
        }))}
        onChange={setClienteId}
      />

      <Select
        label="Veiculo disponivel"
        name="veiculoId"
        value={veiculoId}
        options={veiculos
          .filter((veiculo) => veiculosDisponiveisIds.has(veiculo.id ?? ""))
          .map((veiculo) => ({ value: veiculo.id ?? "", label: veiculo.placa }))}
        onChange={setVeiculoId}
      />

      <Input
        label="Data de Retirada"
        name="dataRetirada"
        type="date"
        value={dataRetirada}
        onChange={setDataRetirada}
      />

      <Input
        label="Data de Devolucao Prevista"
        name="dataDevolucaoPrevista"
        type="date"
        value={dataDevolucaoPrevista}
        onChange={setDataDevolucaoPrevista}
      />

      {veiculoId && dataRetirada && dataDevolucaoPrevista && (
        <p>
          Valor previsto: R${" "}
          {calcularValorLocacao(dataRetirada, dataDevolucaoPrevista, valorDiariaDoVeiculo(veiculoId)).toFixed(2)}
        </p>
      )}

      <h2>Vistoria de Retirada</h2>

      <Input
        label="Km de Retirada"
        name="kmRetirada"
        type="number"
        value={kmRetirada}
        onChange={(valor) => setKmRetirada(Number(valor))}
      />

      <Input
        label="Nivel de Combustivel"
        name="nivelCombustivel"
        value={nivelCombustivel}
        onChange={setNivelCombustivel}
        placeholder="Ex: Cheio, 3/4, Meio tanque"
      />

      <TextArea label="Observacoes" name="observacoes" value={observacoes} onChange={setObservacoes} />

      <Button label="Registrar Locacao" onClick={registrar} />
    </div>
  );
}
