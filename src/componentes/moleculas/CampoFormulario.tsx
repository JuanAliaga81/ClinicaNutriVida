import type { ReactNode } from 'react';

type CampoFormularioProps = {
  id: string;
  etiqueta: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export default function CampoFormulario({ id, etiqueta, error, children, className = 'mb-3' }: CampoFormularioProps) {
  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>{etiqueta}</label>
      {children}
      {error && <p id={`${id}-error`} className="text-danger small mt-1" role="alert">{error}</p>}
    </div>
  );
}
