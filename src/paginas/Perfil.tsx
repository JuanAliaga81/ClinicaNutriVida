import ConversacionContacto from "../componentes/organismos/ConversacionContacto";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cerrarSesion, obtenerUsuarioActual, type Usuario } from "../datos/auth";
import { listarContactosUsuarioApi } from "../datos/contactosApi";
import type { MensajeContacto } from "../datos/mensajesContacto";
import "./PaginasExtra.css";

export default function Perfil() {
  const [usuario] = useState<Usuario | null>(obtenerUsuarioActual);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [cargandoMensajes, setCargandoMensajes] = useState(true);
  const [errorMensajes, setErrorMensajes] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    if (!usuario || !usuario.activo) {
      navegar("/login", { replace: true });
      return;
    }
    if (!usuario.idUsuario) {
      setErrorMensajes("No se encontró el vínculo de tu cuenta con el servidor.");
      setCargandoMensajes(false);
      return;
    }

    let vigente = true;
    listarContactosUsuarioApi(usuario.idUsuario)
      .then((datos) => { if (vigente) setMensajes(datos); })
      .catch((error: unknown) => {
        if (vigente) setErrorMensajes(error instanceof Error ? error.message : "No se pudieron cargar tus mensajes.");
      })
      .finally(() => { if (vigente) setCargandoMensajes(false); });
    return () => { vigente = false; };
  }, [navegar, usuario]);

  if (!usuario || !usuario.activo) return <main className="container py-5" aria-live="polite">Cargando perfil…</main>;

  return (
    <main className="pagina-extra container py-5 perfil-pagina">
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div><p className="extra-eyebrow">ÁREA PERSONAL</p><h1 className="mb-2">Hola, {usuario.nombre}</h1><p>{usuario.correo}</p></div>
        <button className="btn btn-outline-secondary" type="button" onClick={() => { cerrarSesion(); navegar("/inicio"); }}>Cerrar sesión</button>
      </header>

      <section className="card card-body shadow-sm perfil-seccion">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div><h2 className="h4 mb-1">Mis citas</h2><p className="mb-0">Consulta las solicitudes que están guardadas en el sistema.</p></div>
          <div className="d-flex flex-wrap gap-2"><Link className="btn btn-outline-success" to="/citas">Ver mis citas</Link><Link className="btn btn-success" to="/agendar">Reservar una hora</Link></div>
        </div>
      </section>

      <section className="perfil-seccion-mensajes">
        <header className="perfil-mensajes-cabecera"><div><p className="extra-eyebrow">ATENCIÓN NUTRIVIDA</p><h2>Mis mensajes</h2><p>Revisa tus consultas y las respuestas del equipo.</p></div><Link to="/contacto">Escribir a la clínica</Link></header>
        {errorMensajes && <p className="alert alert-danger" role="alert">{errorMensajes}</p>}
        {cargandoMensajes ? <p role="status">Cargando tus mensajes...</p> : mensajes.length === 0 ? <div className="perfil-mensajes-vacio"><span aria-hidden="true">✉</span><p>Aún no tienes mensajes enviados desde Contacto.</p></div> : <div className="perfil-conversaciones">{mensajes.map((mensaje) => <article className="perfil-conversacion" key={mensaje.id}><header><div><h3>{mensaje.asunto}</h3><span>{mensaje.fecha}</span></div><span className="perfil-conversacion-estado">{mensaje.leido ? "Respuesta recibida" : "Esperando respuesta"}</span></header><ConversacionContacto id={mensaje.id} entradas={mensaje.conversacion} nombreUsuario="Tú" respuesta="" alCambiar={() => undefined} onEnviar={() => undefined} soloLectura /></article>)}</div>}
      </section>
    </main>
  );
}