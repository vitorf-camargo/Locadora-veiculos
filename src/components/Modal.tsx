import type { ReactNode } from "react";

interface ModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children?: ReactNode;
}

export function Modal({ show, title, onClose, onConfirm, children }: ModalProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
