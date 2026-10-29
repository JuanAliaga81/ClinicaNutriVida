import FormularioAgendamiento from "../componentes/organismos/FormularioAgendamiento";
import "./PaginasExtra.css";

export default function Agendar() {
  return (
    <main className="pagina-extra agendar-pagina container py-4">
      <section
        className="agendar-panel"
        aria-label="Solicitud de hora NutriVida"
      >
        <aside className="agendar-info">
          <p className="agendar-etiqueta">ATENCIÓN NUTRICIONAL</p>
          <h1>Reserva tu hora</h1>
          <p className="agendar-intro">
            Cuéntanos qué necesitas y te ayudaremos a encontrar el servicio
            adecuado para ti.
          </p>
          <div className="agendar-pasos">
            <div>
              <span>1</span>
              <p>Completa tus datos y elige un servicio.</p>
            </div>
            <div>
              <span>2</span>
              <p>Envía tu solicitud con una fecha tentativa.</p>
            </div>
            <div>
              <span>3</span>
              <p>Te contactaremos para coordinar y confirmar la hora.</p>
            </div>
          </div>
          <div className="agendar-contacto">
            <strong>¿Tienes dudas?</strong>
            <a href="tel:+56912345678">+56 9 1234 5678</a>
            <span>Av. Alemania 1234, Temuco</span>
          </div>
          <div className="agendar-deco" aria-hidden="true">
            ✳
          </div>
        </aside>

        <div className="agendar-contenido">
          <header className="agendar-cabecera">
            <p className="extra-eyebrow">Solicitud de atención</p>
            <h2>Cuéntanos sobre ti</h2>
            <p>Los campos son necesarios para coordinar tu hora.</p>
          </header>
          <FormularioAgendamiento />
        </div>
      </section>
    </main>
  );
}
