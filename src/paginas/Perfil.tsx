import ConversacionContacto from "../componentes/organismos/ConversacionContacto";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion, obtenerUsuarioActual, type Usuario } from '../datos/auth';
import { listarCitasLegadas } from '../datos/citasLegadas';
import {
  crearEntradaConversacion,
  guardarMensajesContacto,
  listarMensajesContacto,
  type MensajeContacto,
} from '../datos/mensajesContacto';
import './PaginasExtra.css';

export default function Perfil() {
  const [usuario] = useState<Usuario | null>(obtenerUsuarioActual);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>(() => listarMensajesContacto().filter((item) => item.correo.toLowerCase() === usuario?.correo.toLowerCase()));
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const navegar = useNavigate();

  useEffect(() => {
    const encontrado = usuario;
    if (!encontrado || !encontrado.activo) {
      navegar('/login', { replace: true });
      return;
    }

    const actualizarMensajes = () => {
      setMensajes(listarMensajesContacto().filter((item) => item.correo.toLowerCase() === encontrado.correo.toLowerCase()));
    };
    window.addEventListener('nutrivida-mensajes', actualizarMensajes);
    window.addEventListener('storage', actualizarMensajes);
    return () => {
      window.removeEventListener('nutrivida-mensajes', actualizarMensajes);
      window.removeEventListener('storage', actualizarMensajes);
    };
  }, [navegar, usuario]);

  function responder(mensaje: MensajeContacto) {
    const texto = (respuestas[mensaje.id] || '').trim();
    if (!texto) return;
    const todos = listarMensajesContacto();
    const actualizados = todos.map((item) => item.id === mensaje.id ? {
      ...item,
      leido: false,
      conversacion: [...item.conversacion, crearEntradaConversacion('usuario', texto)],
    } : item);
    guardarMensajesContacto(actualizados);
    setMensajes(actualizados.filter((item) => item.correo.toLowerCase() === mensaje.correo.toLowerCase()));
    setRespuestas((actuales) => ({ ...actuales, [mensaje.id]: '' }));
  }

  if (!usuario || !usuario.activo) return <main className="container py-5" aria-live="polite">Cargando perfil…</main>;
  const misCitas = listarCitasLegadas().filter((cita) => cita.correo.toLowerCase() === usuario.correo.toLowerCase());

  return (
    <main className="pagina-extra container py-5 perfil-pagina">
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div><p className="extra-eyebrow">ÁREA PERSONAL</p><h1 className="mb-2">Hola, {usuario.nombre}</h1><p>{usuario.correo}</p></div>
        <button className="btn btn-outline-secondary" type="button" onClick={() => { cerrarSesion(); navegar('/inicio'); }}>Cerrar sesión</button>
      </header>

      <section className="card card-body shadow-sm perfil-seccion">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><div><h2 className="h4 mb-1">Mis citas</h2><p className="mb-0">Solicitudes vinculadas a tu correo.</p></div><Link className="btn btn-success" to="/agendar">Reservar una hora</Link></div>
        {misCitas.length === 0 ? <p className="alert alert-light border mb-0">Todavía no tienes citas solicitadas.</p> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Servicio</th><th>Fecha</th><th>Teléfono</th></tr></thead><tbody>{misCitas.map((cita) => <tr key={cita.id}><td>{cita.servicio}</td><td>{cita.fecha}</td><td>{cita.telefono}</td></tr>)}</tbody></table></div>}
      </section>

      <section className="perfil-seccion-mensajes">
        <header className="perfil-mensajes-cabecera"><div><p className="extra-eyebrow">ATENCIÓN NUTRIVIDA</p><h2>Mis mensajes</h2><p>Consulta tus conversaciones con el equipo y responde aquí.</p></div><Link to="/contacto">Escribir a la clínica</Link></header>
        {mensajes.length === 0 ? <div className="perfil-mensajes-vacio"><span aria-hidden="true">✉</span><p>Aún no tienes mensajes. Si escribes a través de Contacto usando este correo, aparecerán aquí.</p></div> : <div className="perfil-conversaciones">{mensajes.map((mensaje) => <article className="perfil-conversacion" key={mensaje.id}><header><div><h3>Conversación con NutriVida</h3><span>{mensaje.fecha}</span></div><span className="perfil-conversacion-estado">{mensaje.conversacion.some((item) => item.autor === 'admin') ? 'Respuesta recibida' : 'Esperando respuesta'}</span></header><ConversacionContacto id={mensaje.id} entradas={mensaje.conversacion} nombreUsuario={'Tú'}
            respuesta={respuestas[mensaje.id] || ''}
            alCambiar={(valor) => setRespuestas((actuales) => ({ ...actuales, [mensaje.id]: valor }))}
            onEnviar={() => responder(mensaje)}  /></article>)}</div>}
      </section>
    </main>
  );
}
