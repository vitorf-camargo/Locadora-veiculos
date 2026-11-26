import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { MarcaList } from "./pages/marcas/MarcaList";
import { MarcaForm } from "./pages/marcas/MarcaForm";
import { CategoriaList } from "./pages/categorias/CategoriaList";
import { CategoriaForm } from "./pages/categorias/CategoriaForm";
import { ModeloList } from "./pages/modelos/ModeloList";
import { ModeloForm } from "./pages/modelos/ModeloForm";
import { VeiculoList } from "./pages/veiculos/VeiculoList";
import { VeiculoForm } from "./pages/veiculos/VeiculoForm";
import { ManutencaoList } from "./pages/manutencoes/ManutencaoList";
import { ManutencaoForm } from "./pages/manutencoes/ManutencaoForm";
import { ClienteList } from "./pages/clientes/ClienteList";
import { ClienteForm } from "./pages/clientes/ClienteForm";
import { LocacaoList } from "./pages/locacoes/LocacaoList";
import { LocacaoForm } from "./pages/locacoes/LocacaoForm";
import { LocacaoDetalhe } from "./pages/locacoes/LocacaoDetalhe";
import { DevolucaoForm } from "./pages/locacoes/DevolucaoForm";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/marcas" element={<MarcaList />} />
        <Route path="/marcas/novo" element={<MarcaForm />} />
        <Route path="/marcas/:id/editar" element={<MarcaForm />} />

        <Route path="/categorias" element={<CategoriaList />} />
        <Route path="/categorias/novo" element={<CategoriaForm />} />
        <Route path="/categorias/:id/editar" element={<CategoriaForm />} />

        <Route path="/modelos" element={<ModeloList />} />
        <Route path="/modelos/novo" element={<ModeloForm />} />
        <Route path="/modelos/:id/editar" element={<ModeloForm />} />

        <Route path="/veiculos" element={<VeiculoList />} />
        <Route path="/veiculos/novo" element={<VeiculoForm />} />
        <Route path="/veiculos/:id/editar" element={<VeiculoForm />} />

        <Route path="/manutencoes" element={<ManutencaoList />} />
        <Route path="/manutencoes/novo" element={<ManutencaoForm />} />
        <Route path="/manutencoes/:id/editar" element={<ManutencaoForm />} />

        <Route path="/clientes" element={<ClienteList />} />
        <Route path="/clientes/novo" element={<ClienteForm />} />
        <Route path="/clientes/:id/editar" element={<ClienteForm />} />

        <Route path="/locacoes" element={<LocacaoList />} />
        <Route path="/locacoes/novo" element={<LocacaoForm />} />
        <Route path="/locacoes/:id" element={<LocacaoDetalhe />} />
        <Route path="/locacoes/:id/devolucao" element={<DevolucaoForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
