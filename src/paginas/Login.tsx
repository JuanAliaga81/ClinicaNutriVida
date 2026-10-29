import { Link } from "react-router-dom";
import FormularioLogin from "../componentes/organismos/FormularioLogin";
import "./PaginasExtra.css";

export default function Login() {
  return (
    <main className="pagina-extra login-pagina">
      <section className="login-panel" aria-label="Acceso a NutriVida">
        <aside className="login-bienvenida">
          <img src="/img/Logo NutriVida.png" alt="" className="login-logo" />
          <p className="login-sobrelinea">CLÍNICA NUTRICIONAL</p>
          <h1>Tu bienestar, paso a paso.</h1>
          <p className="login-intro">
            Accede a tu espacio personal para revisar tus citas y seguir
            conectado con tu proceso de salud.
          </p>
          <div className="login-detalle">
            <span aria-hidden="true">✓</span>
            <p>Atención cercana y acompañamiento profesional.</p>
          </div>
          <div className="login-detalle">
            <span aria-hidden="true">✓</span>
            <p>Tus próximas horas, siempre a mano.</p>
          </div>
          <div className="login-hojas" aria-hidden="true">
            ✳
          </div>
        </aside>

        <div className="login-formulario">
          <div className="login-formulario-interior">
            <p className="extra-eyebrow">Bienvenida/o de vuelta</p>
            <h2>Iniciar sesión</h2>
            <p className="login-subtitulo">Ingresa tus datos para continuar.</p>

            <FormularioLogin />

            <p className="login-registro">
              ¿Aún no tienes una cuenta?{" "}
              <Link to="/registro">Crear cuenta</Link>
            </p>
            <Link className="login-volver" to="/inicio">
              Volver al inicio
            </Link>
            <p className="login-demo">
              Acceso de demostración: <strong>admin@nutrivida.cl</strong>
              <br />
              Contraseña: <strong>NutriVida1</strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
