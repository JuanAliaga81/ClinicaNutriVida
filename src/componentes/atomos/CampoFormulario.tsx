import type { ReactNode } from 'react';

type CampoFormularioProps = {
  id: string;
  etiqueta: string;
  error?: string;
  children: ReactNode;
};

export default function CampoFormulario({ id, etiqueta, error, children }: CampoFormularioProps) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>{etiqueta}</label>
      {children}
      {error && <p className="text-danger small mt-1" role="alert">{error}</p>}
    </div>
  );
}
