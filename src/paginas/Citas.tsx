import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { guardarCitasLegadas, listarCitasLegadas, type CitaLegada } from '../datos/citasLegadas';
import './PaginasExtra.css';

export default function Citas() {
  const [citas, setCitas] = useState<CitaLegada[]>(() => listarCitasLegadas());

  useEffect(() => {
    const actualizar = () => setCitas(listarCitasLegadas());
    window.addEventListener('storage', actualizar);
    return () => window.removeEventListener('storage', actualizar);
  }, []);

  function eliminar(id: number) {
    if (!window.confirm('¿Quieres eliminar esta solicitud de cita?')) return;
    const restantes = citas.filter((cita) => cita.id !== id);
    guardarCitasLegadas(restantes);
    setCitas(restantes);
  }

  function limpiar() {
    if (!window.confirm('¿Quieres borrar todas las citas guardadas en este navegador?')) return;
    guardarCitasLegadas([]);
    setCitas([]);
  }

  return (
    <main className="pagina-extra citas-pagina container py-5">
      <header className="citas-encabezado">
        <div>
          <p className="extra-eyebrow">NUTRIVIDA · SOLICITUDES</p>
          <h1>Gestión de citas</h1>
          <p>Revisa las horas solicitadas y sus datos de contacto.</p>
        </div>
        <div className="citas-resumen">
          <span className="citas-total">{citas.length}</span>
          <span>{citas.length === 1 ? 'solicitud registrada' : 'solicitudes registradas'}</span>
        </div>
      </header>

      <div className="citas-acciones-superiores">
        <Link className="citas-agendar" to="/agendar">+ Agendar una hora</Link>
        {citas.length > 0 && (
          <button className="citas-borrar-todo" type="button" onClick={limpiar}>
            Borrar historial
          </button>
        )}
      </div>

      {citas.length === 0 ? (
        <section className="citas-vacio">
          <span className="citas-vacio-icono" aria-hidden="true">▦</span>
          <h2>Aún no hay citas solicitadas</h2>
          <p>Cuando envíes una solicitud, aparecerá aquí para que puedas consultarla.</p>
          <Link className="citas-agendar" to="/agendar">Reservar mi primera hora</Link>
        </section>
      ) : (
        <section className="citas-listado" aria-label="Citas solicitadas">
          {citas.map((cita) => (
            <article className="cita-tarjeta" key={cita.id}>
              <header className="cita-tarjeta-cabecera">
                <div className="cita-servicio-icono" aria-hidden="true">✳</div>
                <div className="cita-servicio">
                  <p>Servicio solicitado</p>
                  <h2>{cita.servicio}</h2>
                </div>
                <span className="cita-pendiente"><i aria-hidden="true" />Pendiente</span>
              </header>

              <div className="cita-detalles">
                <div><span>Fecha tentativa</span><strong>{cita.fecha}</strong></div>
                <div><span>Paciente</span><strong>{cita.nombre}</strong></div>
                <div><span>Correo</span><strong>{cita.correo}</strong></div>
                <div><span>Teléfono</span><strong>{cita.telefono}</strong></div>
                <div><span>RUT</span><strong>{cita.rut}</strong></div>
                <div><span>Fecha de solicitud</span><strong>{cita.fechaRegistro}</strong></div>
              </div>

              <footer className="cita-tarjeta-pie">
                <p>La clínica debe confirmar la fecha y hora contigo.</p>
                <button className="cita-eliminar" type="button" onClick={() => eliminar(cita.id)}>
                  Eliminar solicitud
                </button>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
