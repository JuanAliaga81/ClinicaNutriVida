import type { Servicio } from '../../datos/catalogo';

type CardCatalogoServicioProps = { servicio: Servicio };

const pesos = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export default function CardCatalogoServicio({ servicio }: CardCatalogoServicioProps) {
  return (
    <article className="card-servicio-col">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <span className="badge text-bg-success mb-2">{servicio.tipo}</span>
          <h2 className="h5 card-title">{servicio.nombre}</h2>
          <p className="card-text">{servicio.descripcion}</p>
          <p className="card-text"><strong>Duración:</strong> {servicio.duracion}</p>
          <p className="card-text"><strong>Modalidad:</strong> {servicio.modalidad}</p>
          <p className="card-text fw-bold text-success mb-0">{pesos.format(servicio.precio)}</p>
        </div>
      </div>
    </article>
  );
}
