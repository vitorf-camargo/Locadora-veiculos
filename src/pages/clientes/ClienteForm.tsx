import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";
import { clienteService } from "../../service/clienteService";
import { clienteInicial, type Cliente } from "../../models/Cliente";

export function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente>(clienteInicial);
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    clienteService.listar().then(setTodosClientes);
    if (id) {
      clienteService.buscarPorId(id).then(setCliente);
    }
  }, [id]);

  function salvar() {
    if (cliente.nome.trim() === "" || cliente.cpf.trim() === "" || cliente.cnh.trim() === "") {
      setErro("Nome, CPF e CNH sao obrigatorios");
      return;
    }

    const cpfDuplicado = todosClientes.some((outro) => outro.id !== id && outro.cpf === cliente.cpf);
    const cnhDuplicada = todosClientes.some((outro) => outro.id !== id && outro.cnh === cliente.cnh);

    if (cpfDuplicado) {
      setErro("Ja existe um cliente cadastrado com esse CPF");
      return;
    }

    if (cnhDuplicada) {
      setErro("Ja existe um cliente cadastrado com essa CNH");
      return;
    }

    const operacao = id ? clienteService.atualizar(id, cliente) : clienteService.criar(cliente);

    operacao
      .then(() => navigate("/clientes"))
      .catch((error: Error) => setErro(error.message));
  }

  return (
    <div className="container">
      <h1>{id ? "Editar Cliente" : "Novo Cliente"}</h1>

      <Alert type="danger" message={erro} />

      <Input
        label="Nome"
        name="nome"
        value={cliente.nome}
        onChange={(valor) => setCliente({ ...cliente, nome: valor })}
      />

      <Input
        label="CPF"
        name="cpf"
        value={cliente.cpf}
        onChange={(valor) => setCliente({ ...cliente, cpf: valor })}
        placeholder="Somente numeros"
      />

      <Input
        label="CNH"
        name="cnh"
        value={cliente.cnh}
        onChange={(valor) => setCliente({ ...cliente, cnh: valor })}
      />

      <Input
        label="Validade da CNH"
        name="validadeCnh"
        type="date"
        value={cliente.validadeCnh}
        onChange={(valor) => setCliente({ ...cliente, validadeCnh: valor })}
      />

      <Input
        label="Telefone"
        name="telefone"
        type="tel"
        value={cliente.telefone}
        onChange={(valor) => setCliente({ ...cliente, telefone: valor })}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={cliente.email}
        onChange={(valor) => setCliente({ ...cliente, email: valor })}
      />

      <Input
        label="Endereco"
        name="endereco"
        value={cliente.endereco}
        onChange={(valor) => setCliente({ ...cliente, endereco: valor })}
      />

      <Button label="Salvar" onClick={salvar} />
    </div>
  );
}
