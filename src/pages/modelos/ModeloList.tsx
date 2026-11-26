import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Alert } from "../../components/Alert";
import { modeloService } from "../../service/modeloService";
import { marcaService } from "../../service/marcaService";
import { categoriaService } from "../../service/categoriaService";
import type { Modelo } from "../../models/Modelo";
import type { Marca } from "../../models/Marca";
import type { Categoria } from "../../models/Categoria";

export function ModeloList() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modeloParaExcluir, setModeloParaExcluir] = useState<Modelo | null>(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
    marcaService.listar().then(setMarcas);
    categoriaService.listar().then(setCategorias);
  }, []);

  function carregar() {
    modeloService.listar().then(setModelos);
  }

  function nomeMarca(marcaId: string): string {
    return marcas.find((marca) => marca.id === marcaId)?.nome ?? "-";
  }

  function nomeCategoria(categoriaId: string): string {
    return categorias.find((categoria) => categoria.id === categoriaId)?.nome ?? "-";
  }

  function confirmarExclusao() {
    if (!modeloParaExcluir || !modeloParaExcluir.id) {
      return;
    }

    modeloService
      .excluir(modeloParaExcluir.id)
      .then(() => {
        setModeloParaExcluir(null);
        setErro("");
        carregar();
      })
      .catch((error: Error) => {
        setErro(error.message);
        setModeloParaExcluir(null);
      });
  }

  return (
    <div className="container">
      <h1>Modelos</h1>

      <Alert type="danger" message={erro} />

      <div className="mb-3">
        <Button label="Novo Modelo" onClick={() => navigate("/modelos/novo")} />
      </div>

      <Table<Modelo>
        columns={[
          { titulo: "Nome", render: (modelo) => modelo.nome },
          { titulo: "Ano", render: (modelo) => modelo.ano },
          { titulo: "Marca", render: (modelo) => nomeMarca(modelo.marcaId) },
          { titulo: "Categoria", render: (modelo) => nomeCategoria(modelo.categoriaId) },
        ]}
        data={modelos}
        onEditar={(modelo) => navigate(`/modelos/${modelo.id}/editar`)}
        onExcluir={(modelo) => setModeloParaExcluir(modelo)}
      />

      <Modal
        show={modeloParaExcluir !== null}
        title="Excluir modelo"
        onClose={() => setModeloParaExcluir(null)}
        onConfirm={confirmarExclusao}
      >
        Tem certeza que deseja excluir o modelo "{modeloParaExcluir?.nome}"?
      </Modal>
    </div>
  );
}
