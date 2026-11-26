import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Alert } from "../../components/Alert";
import { marcaService } from "../../service/marcaService";
import type { Marca } from "../../models/Marca";

export function MarcaList() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcaParaExcluir, setMarcaParaExcluir] = useState<Marca | null>(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    marcaService.listar().then(setMarcas);
  }

  function confirmarExclusao() {
    if (!marcaParaExcluir || !marcaParaExcluir.id) {
      return;
    }

    marcaService
      .excluir(marcaParaExcluir.id)
      .then(() => {
        setMarcaParaExcluir(null);
        setErro("");
        carregar();
      })
      .catch((error: Error) => {
        setErro(error.message);
        setMarcaParaExcluir(null);
      });
  }

  return (
    <div className="container">
      <h1>Marcas</h1>

      <Alert type="danger" message={erro} />

      <div className="mb-3">
        <Button label="Nova Marca" onClick={() => navigate("/marcas/novo")} />
      </div>

      <Table<Marca>
        columns={[{ titulo: "Nome", render: (marca) => marca.nome }]}
        data={marcas}
        onEditar={(marca) => navigate(`/marcas/${marca.id}/editar`)}
        onExcluir={(marca) => setMarcaParaExcluir(marca)}
      />

      <Modal
        show={marcaParaExcluir !== null}
        title="Excluir marca"
        onClose={() => setMarcaParaExcluir(null)}
        onConfirm={confirmarExclusao}
      >
        Tem certeza que deseja excluir a marca "{marcaParaExcluir?.nome}"?
      </Modal>
    </div>
  );
}
