import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { guardarUsuarios, listarUsuarios } from '../datos/auth';
import CampoFormulario from '../componentes/atomos/CampoFormulario';
import './PaginasExtra.css';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const navegar = useNavigate();

  function enviar(e: FormEvent) {
    e.preventDefault();
    const mail = correo.trim().toLowerCase();

    if (!nombre.trim() || nombre.trim().length > 100) {
      setError('Ingresa tu nombre (máximo 100 caracteres).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError('Ingresa un correo válido.');
      return;
    }
    const usuarios = listarUsuarios();
    if (usuarios.some((u) => u.correo.toLowerCase() === mail)) {
      setError('Este correo ya está registrado.');
      return;
    }
    if (clave.length < 4 || clave.length > 10) {
      setError('La contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }
    if (clave !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    guardarUsuarios([...usuarios, { nombre: nombre.trim(), correo: mail, clave, rol: 'Paciente', activo: true }]);
    navegar('/login', { state: { registrado: true } });
  }

  return (
    <main className="pagina-extra registro-pagina">
      <section className="registro-panel" aria-label="Crear cuenta NutriVida">
        <aside className="registro-bienvenida">
          <img src="/img/Logo NutriVida.png" alt="" className="registro-logo" />
          <p className="registro-sobrelinea">UN CAMBIO SALUDABLE COMIENZA AQUÍ</p>
          <h1>Construyamos hábitos que te hagan bien.</h1>
          <p className="registro-intro">
            Crea tu cuenta para mantener tus datos y solicitudes de atención en un solo lugar.
          </p>
          <div className="registro-nota">
            <span aria-hidden="true">♡</span>
            <p>Un espacio pensado para acompañarte en cada etapa de tu proceso.</p>
          </div>
          <div className="registro-hojas" aria-hidden="true">✳</div>
        </aside>

        <div className="registro-formulario">
          <div className="registro-formulario-interior">
            <p className="extra-eyebrow">Únete a NutriVida</p>
            <h2>Crear cuenta</h2>
            <p className="registro-subtitulo">Completa tus datos para comenzar.</p>

            <form onSubmit={enviar} noValidate>
              <CampoFormulario id="registro-nombre" etiqueta="Nombre completo">
                <input
                  className="form-control registro-input"
                  id="registro-nombre"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Tu nombre y apellido"
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setError(''); }}
                />
              </CampoFormulario>
              <CampoFormulario id="registro-correo" etiqueta="Correo electrónico">
                <input
                  className="form-control registro-input"
                  id="registro-correo"
                  type="email"
                  autoComplete="email"
                  maxLength={100}
                  placeholder="nombre@correo.cl"
                  value={correo}
                  onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                />
              </CampoFormulario>
              <CampoFormulario id="registro-clave" etiqueta="Contraseña (4 a 10 caracteres)">
                <input
                  className="form-control registro-input"
                  id="registro-clave"
                  type="password"
                  autoComplete="new-password"
                  maxLength={10}
                  placeholder="Crea una contraseña"
                  value={clave}
                  onChange={(e) => { setClave(e.target.value); setError(''); }}
                />
              </CampoFormulario>
              <CampoFormulario id="registro-confirmar" etiqueta="Confirmar contraseña">
                <input
                  className="form-control registro-input"
                  id="registro-confirmar"
                  type="password"
                  autoComplete="new-password"
                  maxLength={10}
                  placeholder="Escríbela nuevamente"
                  value={confirmar}
                  onChange={(e) => { setConfirmar(e.target.value); setError(''); }}
                />
              </CampoFormulario>

              {error && <p className="alert alert-danger registro-error" role="alert">{error}</p>}
              <button className="btn btn-success registro-submit" type="submit">Crear mi cuenta</button>
            </form>

            <p className="registro-login">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
            <Link className="registro-volver" to="/inicio">Volver al inicio</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
