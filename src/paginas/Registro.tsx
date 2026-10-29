import { Link } from "react-router-dom";
import FormularioRegistro from "../componentes/organismos/FormularioRegistro";
import "./PaginasExtra.css";

export default function Registro() {
  return (
    <main className="pagina-extra registro-pagina">
      <section className="registro-panel" aria-label="Crear cuenta NutriVida">
        <aside className="registro-bienvenida">
          <img src="/img/Logo NutriVida.png" alt="" className="registro-logo" />
          <p className="registro-sobrelinea">
            UN CAMBIO SALUDABLE COMIENZA AQUÍ
          </p>
          <h1>Construyamos hábitos que te hagan bien.</h1>
          <p className="registro-intro">
            Crea tu cuenta para mantener tus datos y solicitudes de atención en
            un solo lugar.
          </p>
          <div className="registro-nota">
            <span aria-hidden="true">♡</span>
            <p>
              Un espacio pensado para acompañarte en cada etapa de tu proceso.
            </p>
          </div>
          <div className="registro-hojas" aria-hidden="true">
            ✳
          </div>
        </aside>

        <div className="registro-formulario">
          <div className="registro-formulario-interior">
            <p className="extra-eyebrow">Únete a NutriVida</p>
            <h2>Crear cuenta</h2>
            <p className="registro-subtitulo">
              Completa tus datos para comenzar.
            </p>

            <FormularioRegistro />

            <p className="registro-login">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
            <Link className="registro-volver" to="/inicio">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
