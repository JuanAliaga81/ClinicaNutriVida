import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { CitaLegada } from '../datos/citasLegadas';
import './PaginasExtra.css';

function cargarReserva(): CitaLegada | null {
  try {
    const raw = sessionStorage.getItem('reservaNutriVida');
    return raw ? JSON.parse(raw) as CitaLegada : null;
  } catch {
    return null;
  }
}

function ocultarCorreo(correo: string) {
  const [usuario, dominio] = correo.split('@');
  return usuario && dominio ? `${usuario.slice(0, 3)}***@${dominio}` : correo;
}

export default function Confirmacion() {
  const cita = useMemo(cargarReserva, []);

  return (
    <main className="pagina-extra confirmacion-pagina container py-5">
      <section className="confirmacion-panel" aria-live="polite">
        {cita ? (
          <>
            <header className="confirmacion-hero">
              <span className="confirmacion-check" aria-hidden="true">✓</span>
              <p className="confirmacion-etiqueta">NUTRIVIDA · SOLICITUD RECIBIDA</p>
              <h1>¡Gracias, {cita.nombre.split(' ')[0]}!</h1>
              <p>Recibimos tu solicitud. Nos pondremos en contacto para coordinar y confirmar la hora.</p>
            </header>

            <div className="confirmacion-contenido">
              <div className="confirmacion-resumen-cabecera">
                <div>
                  <p className="extra-eyebrow">Tu próxima atención</p>
                  <h2>Resumen de la solicitud</h2>
                </div>
                <span className="confirmacion-estado"><i aria-hidden="true" />Pendiente de confirmación</span>
              </div>

              <dl className="confirmacion-datos">
                <div><dt>Servicio</dt><dd>{cita.servicio}</dd></div>
                <div><dt>Fecha tentativa</dt><dd>{cita.fecha}</dd></div>
                <div><dt>Nombre</dt><dd>{cita.nombre}</dd></div>
                <div><dt>RUT</dt><dd>{cita.rut}</dd></div>
                <div><dt>Correo</dt><dd>{cita.correo}</dd></div>
                <div><dt>Teléfono</dt><dd>{cita.telefono}</dd></div>
              </dl>

              <p className="confirmacion-nota">
                Guardamos esta solicitud en este navegador. El resumen está asociado a {ocultarCorreo(cita.correo)}.
              </p>

              <div className="confirmacion-acciones">
                <Link className="confirmacion-primary" to="/citas">Ver mis solicitudes <span aria-hidden="true">→</span></Link>
                <Link className="confirmacion-secondary" to="/inicio">Volver al inicio</Link>
              </div>
            </div>
          </>
        ) : (
          <div className="confirmacion-vacia">
            <span className="confirmacion-check confirmacion-check-vacio" aria-hidden="true">i</span>
            <p className="extra-eyebrow">NutriVida</p>
            <h1>No hay una reserva reciente</h1>
            <p>Para ver una confirmación, primero completa el formulario de reserva.</p>
            <Link className="confirmacion-primary" to="/agendar">Reservar una hora <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </section>
    </main>
  );
}
