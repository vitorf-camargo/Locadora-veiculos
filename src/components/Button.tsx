interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ label, variant = "primary", type = "button", onClick, disabled }: ButtonProps) {
  return (
    <button type={type} className={`btn btn-${variant}`} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
