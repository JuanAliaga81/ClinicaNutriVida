import { Link, useParams } from 'react-router-dom';
import { listarServicios } from '../datos/catalogo';
import './DetalleServicio.css';

const pesos = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export default function DetalleServicio() {
  const { codigo } = useParams<{ codigo: string }>();
  const servicio = listarServicios().find((item) => item.codigo === codigo);

  if (!servicio) {
    return (
      <main className="container py-5">
        <h1>Servicio no encontrado</h1>
        <p>El servicio que buscas ya no está disponible en el catálogo.</p>
        <Link className="btn btn-outline-success" to="/servicios">
          Volver a servicios
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-4 py-lg-5 pagina-detalle-servicio">
      <Link className="detalle-servicio-volver" to="/servicios">
        ← Volver a servicios
      </Link>

      <article className="row g-4 g-lg-5 align-items-center mt-1">
        <div className="col-12 col-lg-6">
          <img
            className="detalle-servicio-imagen"
            src={servicio.imagen || '/img/Doctor.jpg'}
            alt={`Imagen de ${servicio.nombre}`}
          />
        </div>

        <div className="col-12 col-lg-6">
          <span className="badge rounded-pill text-bg-success mb-3">
            {servicio.tipo}
          </span>
          <h1>{servicio.nombre}</h1>
          <p className="detalle-servicio-descripcion">{servicio.descripcion}</p>

          <dl className="detalle-servicio-datos">
            <div>
              <dt>Duración</dt>
              <dd>{servicio.duracion || 'Por confirmar'}</dd>
            </div>
            <div>
              <dt>Modalidad</dt>
              <dd>{servicio.modalidad || 'Por confirmar'}</dd>
            </div>
            <div>
              <dt>Profesional</dt>
              <dd>{servicio.profesional || 'Equipo NutriVida'}</dd>
            </div>
          </dl>

          <p className="detalle-servicio-precio">{pesos.format(servicio.precio)}</p>

          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-success" to={`/agendar?servicio=${encodeURIComponent(servicio.codigo)}`}>
              Reserva tu hora
            </Link>
            <Link className="btn btn-outline-success" to="/servicios">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
