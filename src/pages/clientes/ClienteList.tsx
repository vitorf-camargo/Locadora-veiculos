import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Alert } from "../../components/Alert";
import { clienteService } from "../../service/clienteService";
import { cnhVencida, type Cliente } from "../../models/Cliente";

export function ClienteList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    clienteService.listar().then(setClientes);
  }

  function confirmarExclusao() {
    if (!clienteParaExcluir || !clienteParaExcluir.id) {
      return;
    }

    clienteService
      .excluir(clienteParaExcluir.id)
      .then(() => {
        setClienteParaExcluir(null);
        setErro("");
        carregar();
      })
      .catch((error: Error) => {
        setErro(error.message);
        setClienteParaExcluir(null);
      });
  }

  return (
    <div className="container">
      <h1>Clientes</h1>

      <Alert type="danger" message={erro} />

      <div className="mb-3">
        <Button label="Novo Cliente" onClick={() => navigate("/clientes/novo")} />
      </div>

      <Table<Cliente>
        columns={[
          { titulo: "Nome", render: (cliente) => cliente.nome },
          { titulo: "CPF", render: (cliente) => cliente.cpf },
          { titulo: "CNH", render: (cliente) => cliente.cnh },
          {
            titulo: "Validade CNH",
            render: (cliente) => (cnhVencida(cliente) ? `${cliente.validadeCnh} (vencida)` : cliente.validadeCnh),
          },
          { titulo: "Telefone", render: (cliente) => cliente.telefone },
        ]}
        data={clientes}
        onEditar={(cliente) => navigate(`/clientes/${cliente.id}/editar`)}
        onExcluir={(cliente) => setClienteParaExcluir(cliente)}
      />

      <Modal
        show={clienteParaExcluir !== null}
        title="Excluir cliente"
        onClose={() => setClienteParaExcluir(null)}
        onConfirm={confirmarExclusao}
      >
        Tem certeza que deseja excluir o cliente "{clienteParaExcluir?.nome}"?
      </Modal>
    </div>
  );
}
