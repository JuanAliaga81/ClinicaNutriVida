import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion, listarUsuarios, obtenerSesion, type Usuario } from '../datos/auth';
import { listarCitasLegadas } from '../datos/citasLegadas';
import {
  guardarMensajesContacto,
  listarMensajesContacto,
  type MensajeContacto,
} from '../datos/mensajesContacto';
import './PaginasExtra.css';

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const navegar = useNavigate();

  useEffect(() => {
    const sesion = obtenerSesion();
    const encontrado = sesion
      ? listarUsuarios().find((item) => item.correo.toLowerCase() === sesion.correo.toLowerCase())
      : undefined;
    if (!encontrado || !encontrado.activo) {
      navegar('/login', { replace: true });
      return;
    }
    setUsuario(encontrado);

    const actualizarMensajes = () => {
      setMensajes(listarMensajesContacto().filter((item) => item.correo.toLowerCase() === encontrado.correo.toLowerCase()));
    };
    actualizarMensajes();
    window.addEventListener('nutrivida-mensajes', actualizarMensajes);
    window.addEventListener('storage', actualizarMensajes);
    return () => {
      window.removeEventListener('nutrivida-mensajes', actualizarMensajes);
      window.removeEventListener('storage', actualizarMensajes);
    };
  }, [navegar]);

  function responder(e: FormEvent<HTMLFormElement>, mensaje: MensajeContacto) {
    e.preventDefault();
    const texto = (respuestas[mensaje.id] || '').trim();
    if (!texto) return;
    const todos = listarMensajesContacto();
    const actualizados = todos.map((item) => item.id === mensaje.id ? {
      ...item,
      leido: false,
      conversacion: [...item.conversacion, {
        id: `CHAT-${Date.now()}`,
        autor: 'usuario' as const,
        texto,
        fecha: new Date().toLocaleString('es-CL'),
      }],
    } : item);
    guardarMensajesContacto(actualizados);
    setMensajes(actualizados.filter((item) => item.correo.toLowerCase() === mensaje.correo.toLowerCase()));
    setRespuestas((actuales) => ({ ...actuales, [mensaje.id]: '' }));
  }

  if (!usuario) return <main className="container py-5" aria-live="polite">Cargando perfil…</main>;
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
        {mensajes.length === 0 ? <div className="perfil-mensajes-vacio"><span aria-hidden="true">✉</span><p>Aún no tienes mensajes. Si escribes a través de Contacto usando este correo, aparecerán aquí.</p></div> : <div className="perfil-conversaciones">{mensajes.map((mensaje) => <article className="perfil-conversacion" key={mensaje.id}><header><div><h3>Conversación con NutriVida</h3><span>{mensaje.fecha}</span></div><span className="perfil-conversacion-estado">{mensaje.conversacion.some((item) => item.autor === 'admin') ? 'Respuesta recibida' : 'Esperando respuesta'}</span></header><div className="chat-conversacion">{mensaje.conversacion.map((entrada) => <div className={`chat-fila chat-${entrada.autor}`} key={entrada.id}><div className="chat-burbuja"><span>{entrada.autor === 'admin' ? 'NutriVida' : 'Tú'}</span><p>{entrada.texto}</p><time>{entrada.fecha}</time></div></div>)}</div><form className="chat-responder" onSubmit={(e) => responder(e, mensaje)}><label className="visually-hidden" htmlFor={`respuesta-usuario-${mensaje.id}`}>Responder en esta conversación</label><textarea id={`respuesta-usuario-${mensaje.id}`} className="form-control" rows={2} maxLength={1000} placeholder="Escribe una respuesta..." value={respuestas[mensaje.id] || ''} onChange={(e) => setRespuestas((actuales) => ({ ...actuales, [mensaje.id]: e.target.value }))} /><button className="btn btn-success" type="submit" disabled={!(respuestas[mensaje.id] || '').trim()}>Enviar</button></form></article>)}</div>}
      </section>
    </main>
  );
}
