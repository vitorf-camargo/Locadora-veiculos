interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function TextArea({ label, name, value, onChange, rows = 3 }: TextAreaProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className="form-control"
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
