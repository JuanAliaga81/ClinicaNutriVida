import FormularioContacto from "../componentes/organismos/FormularioContacto";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerUsuarioActual, type Usuario } from "../datos/auth";
import "./PaginasExtra.css";

export default function Contacto() {
  const [usuario, setUsuario] = useState<Usuario | null>(obtenerUsuarioActual);

  useEffect(() => {
    const actualizarSesion = () => setUsuario(obtenerUsuarioActual());
    window.addEventListener("nutrivida-auth", actualizarSesion);
    window.addEventListener("storage", actualizarSesion);
    return () => {
      window.removeEventListener("nutrivida-auth", actualizarSesion);
      window.removeEventListener("storage", actualizarSesion);
    };
  }, []);

  return (
    <main className="pagina-extra contacto-pagina container py-5">
      <section
        className="contacto-panel"
        aria-label="Formulario de contacto NutriVida"
      >
        <aside className="contacto-info">
          <p className="contacto-etiqueta">HABLEMOS</p>
          <h1>Estamos aquí para ayudarte.</h1>
          <p className="contacto-intro">
            Escríbenos tus dudas y nuestro equipo te orientará sobre nuestros
            servicios.
          </p>

          <div className="contacto-datos">
            <div>
              <span aria-hidden="true">⌖</span>
              <p>
                <strong>Visítanos</strong>Av. Alemania 1234, Temuco
              </p>
            </div>
            <div>
              <span aria-hidden="true">☎</span>
              <p>
                <strong>Llámanos</strong>
                <a href="tel:+56912345678">+56 9 1234 5678</a>
              </p>
            </div>
            <div>
              <span aria-hidden="true">✉</span>
              <p>
                <strong>Escríbenos</strong>
                <a href="mailto:contacto@nutrivida.cl">contacto@nutrivida.cl</a>
              </p>
            </div>
          </div>
          <p className="contacto-horario">
            Atención cercana y personalizada en cada etapa de tu proceso.
          </p>
          <div className="contacto-deco" aria-hidden="true">
            ✳
          </div>
        </aside>

        <div className="contacto-formulario">
          <header className="contacto-cabecera">
            <p className="extra-eyebrow">Contacto</p>
            <h2>Envíanos un mensaje</h2>
            <p>Completa el formulario y cuéntanos cómo podemos ayudarte.</p>
          </header>

          {usuario?.activo ? (
            <FormularioContacto />
          ) : (
            <div className="alert alert-info contacto-acceso" role="status">
              <h3 className="h5">Inicia sesión para escribirnos</h3>
              <p>Tu mensaje quedará asociado a tu cuenta para que puedas revisar la conversación y sus respuestas.</p>
              <div className="contacto-acceso-acciones">
                <Link className="btn btn-success" to="/login">Iniciar sesión</Link>
                <Link className="btn btn-outline-success" to="/registro">Crear cuenta</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
