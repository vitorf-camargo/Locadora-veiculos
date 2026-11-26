import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Alert } from "../../components/Alert";
import { categoriaService } from "../../service/categoriaService";
import type { Categoria } from "../../models/Categoria";

export function CategoriaList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<Categoria | null>(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    categoriaService.listar().then(setCategorias);
  }

  function confirmarExclusao() {
    if (!categoriaParaExcluir || !categoriaParaExcluir.id) {
      return;
    }

    categoriaService
      .excluir(categoriaParaExcluir.id)
      .then(() => {
        setCategoriaParaExcluir(null);
        setErro("");
        carregar();
      })
      .catch((error: Error) => {
        setErro(error.message);
        setCategoriaParaExcluir(null);
      });
  }

  return (
    <div className="container">
      <h1>Categorias</h1>

      <Alert type="danger" message={erro} />

      <div className="mb-3">
        <Button label="Nova Categoria" onClick={() => navigate("/categorias/novo")} />
      </div>

      <Table<Categoria>
        columns={[
          { titulo: "Nome", render: (categoria) => categoria.nome },
          { titulo: "Valor da Diaria", render: (categoria) => `R$ ${categoria.valorLocacao.toFixed(2)}` },
        ]}
        data={categorias}
        onEditar={(categoria) => navigate(`/categorias/${categoria.id}/editar`)}
        onExcluir={(categoria) => setCategoriaParaExcluir(categoria)}
      />

      <Modal
        show={categoriaParaExcluir !== null}
        title="Excluir categoria"
        onClose={() => setCategoriaParaExcluir(null)}
        onConfirm={confirmarExclusao}
      >
        Tem certeza que deseja excluir a categoria "{categoriaParaExcluir?.nome}"?
      </Modal>
    </div>
  );
}
