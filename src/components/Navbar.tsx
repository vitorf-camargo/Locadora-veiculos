import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Locadora de Veiculos
        </Link>
        <div className="navbar-nav flex-row flex-wrap gap-2">
          <Link className="nav-link" to="/marcas">
            Marcas
          </Link>
          <Link className="nav-link" to="/categorias">
            Categorias
          </Link>
          <Link className="nav-link" to="/modelos">
            Modelos
          </Link>
          <Link className="nav-link" to="/veiculos">
            Veiculos
          </Link>
          <Link className="nav-link" to="/manutencoes">
            Manutencoes
          </Link>
          <Link className="nav-link" to="/clientes">
            Clientes
          </Link>
          <Link className="nav-link" to="/locacoes">
            Locacoes
          </Link>
        </div>
      </div>
    </nav>
  );
}
