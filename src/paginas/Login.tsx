import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inicializarAdminDemo, iniciarSesion, listarUsuarios } from '../datos/auth';
import CampoFormulario from '../componentes/atomos/CampoFormulario';
import './PaginasExtra.css';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navegar = useNavigate();

  useEffect(() => {
    inicializarAdminDemo();
  }, []);

  function enviar(e: FormEvent) {
    e.preventDefault();
    const normalizado = correo.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizado)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (clave.length < 4 || clave.length > 10) {
      setError('La contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }
    const usuario = listarUsuarios().find(
      (u) => u.correo.toLowerCase() === normalizado && u.clave === clave && u.activo,
    );
    if (!usuario) {
      setError('Correo o contraseña incorrectos. Si aún no tienes cuenta, regístrate.');
      return;
    }
    iniciarSesion(usuario.correo);
    navegar(usuario.rol === 'Administrador' ? '/admin' : '/perfil');
  }

  return (
    <main className="pagina-extra login-pagina">
      <section className="login-panel" aria-label="Acceso a NutriVida">
        <aside className="login-bienvenida">
          <img src="/img/Logo NutriVida.png" alt="" className="login-logo" />
          <p className="login-sobrelinea">CLÍNICA NUTRICIONAL</p>
          <h1>Tu bienestar, paso a paso.</h1>
          <p className="login-intro">
            Accede a tu espacio personal para revisar tus citas y seguir conectado con tu proceso de salud.
          </p>
          <div className="login-detalle">
            <span aria-hidden="true">✓</span>
            <p>Atención cercana y acompañamiento profesional.</p>
          </div>
          <div className="login-detalle">
            <span aria-hidden="true">✓</span>
            <p>Tus próximas horas, siempre a mano.</p>
          </div>
          <div className="login-hojas" aria-hidden="true">✳</div>
        </aside>

        <div className="login-formulario">
          <div className="login-formulario-interior">
            <p className="extra-eyebrow">Bienvenida/o de vuelta</p>
            <h2>Iniciar sesión</h2>
            <p className="login-subtitulo">Ingresa tus datos para continuar.</p>

            <form onSubmit={enviar} noValidate>
              <CampoFormulario id="login-correo" etiqueta="Correo electrónico">
                <input
                  className="form-control login-input"
                  id="login-correo"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.cl"
                  value={correo}
                  onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                />
              </CampoFormulario>
              <CampoFormulario id="login-clave" etiqueta="Contraseña">
                <input
                  className="form-control login-input"
                  id="login-clave"
                  type="password"
                  autoComplete="current-password"
                  maxLength={10}
                  placeholder="Ingresa tu contraseña"
                  value={clave}
                  onChange={(e) => { setClave(e.target.value); setError(''); }}
                />
              </CampoFormulario>
              {error && <p className="alert alert-danger login-error" role="alert">{error}</p>}
              <button type="submit" className="btn btn-success login-submit">Ingresar a mi cuenta</button>
            </form>

            <p className="login-registro">
              ¿Aún no tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
            </p>
            <Link className="login-volver" to="/inicio">Volver al inicio</Link>
            <p className="login-demo">Acceso de demostración: <strong>admin@nutrivida.cl</strong><br />Contraseña: <strong>NutriVida1</strong></p>
          </div>
        </div>
      </section>
    </main>
  );
}
