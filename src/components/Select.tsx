export interface OpcaoSelect {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string;
  options: OpcaoSelect[];
  onChange: (value: string) => void;
}

export function Select({ label, name, value, options, onChange }: SelectProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecione...</option>
        {options.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </select>
    </div>
  );
}
