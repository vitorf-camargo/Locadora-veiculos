import type { ReactNode } from "react";

export interface Coluna<T> {
  titulo: string;
  render: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Coluna<T>[];
  data: T[];
  onEditar?: (item: T) => void;
  onExcluir?: (item: T) => void;
}

export function Table<T>({ columns, data, onEditar, onExcluir }: TableProps<T>) {
  const temAcoes = Boolean(onEditar || onExcluir);

  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          {columns.map((coluna, i) => (
            <th key={i}>{coluna.titulo}</th>
          ))}
          {temAcoes && <th>Acoes</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            {columns.map((coluna, j) => (
              <td key={j}>{coluna.render(item)}</td>
            ))}
            {temAcoes && (
              <td>
                {onEditar && (
                  <button className="btn btn-warning btn-sm me-1" onClick={() => onEditar(item)}>
                    Editar
                  </button>
                )}
                {onExcluir && (
                  <button className="btn btn-danger btn-sm" onClick={() => onExcluir(item)}>
                    Excluir
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
