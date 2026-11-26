import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { locacaoService } from "../../service/locacaoService";
import { veiculoService } from "../../service/veiculoService";
import { vistoriaService } from "../../service/vistoriaService";
import { modeloService } from "../../service/modeloService";
import { categoriaService } from "../../service/categoriaService";
import { calcularValorLocacao } from "../../models/Locacao";
import type { Locacao } from "../../models/Locacao";
import type { Veiculo } from "../../models/Veiculo";

export function DevolucaoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [locacao, setLocacao] = useState<Locacao | null>(null);
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [kmDevolucao, setKmDevolucao] = useState(0);
  const [nivelCombustivel, setNivelCombustivel] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (id) {
      locacaoService.buscarPorId(id).then((loc) => {
        setLocacao(loc);
        setKmDevolucao(loc.kmRetirada);
        veiculoService.buscarPorId(loc.veiculoId).then(setVeiculo);
      });
    }
  }, [id]);

  async function finalizar() {
    if (!id || !locacao) return;

    if (kmDevolucao < locacao.kmRetirada) {
      setErro("O km de devolucao nao pode ser menor que o km de retirada");
      return;
    }

    const dataDevolucaoReal = new Date().toISOString().slice(0, 10);

    const modelo = veiculo ? await modeloService.buscarPorId(veiculo.modeloId) : null;
    const categoria = modelo ? await categoriaService.buscarPorId(modelo.categoriaId) : null;
    const valorDiaria = categoria?.valorLocacao ?? 0;
    const valorTotal = calcularValorLocacao(locacao.dataRetirada, dataDevolucaoReal, valorDiaria);

    try {
      await vistoriaService.criar({
        tipo: "DEVOLUCAO",
        data: dataDevolucaoReal,
        km: kmDevolucao,
        nivelCombustivel,
        observacoes,
        locacaoId: id,
      });

      await locacaoService.atualizar(id, {
        ...locacao,
        dataDevolucaoReal,
        kmDevolucao,
        valorTotal,
        status: "FINALIZADA",
      });

      if (veiculo && veiculo.id) {
        await veiculoService.atualizar(veiculo.id, { ...veiculo, kmRodado: kmDevolucao });
      }

      navigate(`/locacoes/${id}`);
    } catch (error) {
      setErro((error as Error).message);
    }
  }

  if (!locacao) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div className="container">
      <h1>Devolucao da Locacao #{locacao.id}</h1>

      <Alert type="danger" message={erro} />

      <p>Km de retirada: {locacao.kmRetirada}</p>

      <Input
        label="Km de Devolucao"
        name="kmDevolucao"
        type="number"
        value={kmDevolucao}
        onChange={(valor) => setKmDevolucao(Number(valor))}
      />

      <Input
        label="Nivel de Combustivel"
        name="nivelCombustivel"
        value={nivelCombustivel}
        onChange={setNivelCombustivel}
      />

      <TextArea label="Observacoes" name="observacoes" value={observacoes} onChange={setObservacoes} />

      <Button label="Finalizar Locacao" onClick={finalizar} />
    </div>
  );
}
