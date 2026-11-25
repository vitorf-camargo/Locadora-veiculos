interface InputProps {
  label: string;
  name: string;
  type?: "text" | "number" | "email" | "password" | "date" | "tel";
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function Input({ label, name, type = "text", value, onChange, placeholder, error }: InputProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
