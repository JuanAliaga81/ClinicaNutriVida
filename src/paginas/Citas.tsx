import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerUsuarioActual } from "../datos/auth";
import { eliminarCitaApi, listarCitasPorUsuarioApi, type CitaApi } from "../datos/citas";
import { listarServiciosApi, type Servicio } from "../datos/catalogo";
import { cargarCuentaReserva, type CuentaReserva } from "../datos/personas";
import "./PaginasExtra.css";

type CitaVista = {
  id: number;
  nombre: string;
  rut: string;
  correo: string;
  telefono: string;
  servicio: string;
  fecha: string;
  prevision: string;
  paraQuien: "titular" | "otra-persona";
  fechaNacimiento: string;
  relacion: string;
};

function telefonoContacto(valor: string) {
  const digitos = valor.replace(/\D/g, "");
  const celular = digitos.startsWith("56") && digitos.length === 11 ? digitos.slice(2) : digitos;
  return celular ? `+56 ${celular}` : "No informado";
}

function adaptarCita(cita: CitaApi, cuenta: CuentaReserva, servicios: Servicio[]): CitaVista {
  const titular = cuenta.usuario.persona;
  const vinculo = cuenta.personas.find((item) => item.persona.idPersona === cita.idPersona);
  const persona = cita.idPersona === titular.idPersona ? titular : vinculo?.persona;
  const servicio = servicios.find((item) => Number(item.codigo) === cita.idServicio);
  const esTitular = cita.idPersona === titular.idPersona;

  return {
    id: cita.idCita,
    nombre: persona?.nombre || `Persona ${cita.idPersona}`,
    rut: persona?.rut || "No informado",
    correo: cuenta.usuario.correo,
    telefono: telefonoContacto(cuenta.usuario.celular),
    servicio: servicio?.nombre || `Servicio ${cita.idServicio}`,
    fecha: cita.fecha,
    prevision: cita.prevision,
    paraQuien: esTitular ? "titular" : "otra-persona",
    fechaNacimiento: persona?.fechaNacimiento || "No informada",
    relacion: esTitular ? "Titular de la cuenta" : vinculo?.relacion || "Persona vinculada",
  };
}

function mensajeError(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error al consultar las citas.";
}

export default function Citas() {
  const [citas, setCitas] = useState<CitaVista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [idEliminando, setIdEliminando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let vigente = true;
    const usuarioLocal = obtenerUsuarioActual();

    async function cargarCitas() {
      setCargando(true);
      setError("");
      if (!usuarioLocal?.correo) {
        setError("Inicia sesión para revisar tus citas.");
        setCargando(false);
        return;
      }

      try {
        const cuenta = await cargarCuentaReserva(usuarioLocal.correo);
        const [citasApi, servicios] = await Promise.all([
          listarCitasPorUsuarioApi(cuenta.usuario.idUsuario),
          listarServiciosApi(),
        ]);
        if (vigente) setCitas(citasApi.map((cita) => adaptarCita(cita, cuenta, servicios)));
      } catch (errorCarga) {
        if (vigente) setError(mensajeError(errorCarga));
      } finally {
        if (vigente) setCargando(false);
      }
    }

    void cargarCitas();
    return () => { vigente = false; };
  }, []);

  async function eliminar(id: number) {
    if (!window.confirm("¿Quieres eliminar esta solicitud de cita?")) return;
    setIdEliminando(id);
    setError("");
    try {
      await eliminarCitaApi(id);
      setCitas((actuales) => actuales.filter((cita) => cita.id !== id));
      setMensaje("La cita se eliminó de la base de datos.");
    } catch (errorEliminar) {
      setError(mensajeError(errorEliminar));
    } finally {
      setIdEliminando(null);
    }
  }

  async function limpiar() {
    if (!window.confirm("¿Quieres eliminar todas tus citas de la base de datos?")) return;
    setError("");
    const eliminadas: number[] = [];
    for (const cita of citas) {
      try {
        await eliminarCitaApi(cita.id);
        eliminadas.push(cita.id);
      } catch {
        // Conserva en pantalla las citas que no alcanzaron a eliminarse.
      }
    }
    setCitas((actuales) => actuales.filter((cita) => !eliminadas.includes(cita.id)));
    if (eliminadas.length === citas.length) {
      setMensaje("Se eliminaron todas tus citas.");
    } else {
      setError("Algunas citas no se pudieron eliminar. Puedes intentarlo nuevamente.");
    }
  }

  return (
    <main className="pagina-extra citas-pagina container py-5">
      <header className="citas-encabezado">
        <div>
          <p className="extra-eyebrow">NUTRIVIDA · SOLICITUDES</p>
          <h1>Gestión de citas</h1>
          <p>Revisa las horas solicitadas y sus datos de contacto.</p>
        </div>
        <div className="citas-resumen">
          <span className="citas-total">{citas.length}</span>
          <span>{citas.length === 1 ? "solicitud registrada" : "solicitudes registradas"}</span>
        </div>
      </header>

      <div className="citas-acciones-superiores">
        <Link className="citas-agendar" to="/agendar">+ Agendar una hora</Link>
        {citas.length > 0 && <button className="citas-borrar-todo" type="button" onClick={() => void limpiar()}>Borrar historial</button>}
      </div>

      {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {cargando ? (
        <p role="status">Cargando tus citas...</p>
      ) : error && citas.length === 0 ? (
        <section className="citas-vacio"><h2>No se pudieron cargar las citas</h2><Link className="citas-agendar" to="/login">Iniciar sesión</Link></section>
      ) : citas.length === 0 ? (
        <section className="citas-vacio">
          <span className="citas-vacio-icono" aria-hidden="true">▦</span>
          <h2>Aún no hay citas solicitadas</h2>
          <p>Cuando envíes una solicitud, aparecerá aquí para que puedas consultarla.</p>
          <Link className="citas-agendar" to="/agendar">Reservar mi primera hora</Link>
        </section>
      ) : (
        <section className="citas-listado" aria-label="Citas solicitadas">
          {citas.map((cita) => (
            <article className="cita-tarjeta" key={cita.id}>
              <header className="cita-tarjeta-cabecera">
                <div className="cita-servicio-icono" aria-hidden="true">✳</div>
                <div className="cita-servicio"><p>Servicio solicitado</p><h2>{cita.servicio}</h2></div>
              </header>
              <div className="cita-detalles">
                <div><span>Fecha tentativa</span><strong>{cita.fecha}</strong></div>
                <div><span>Paciente</span><strong>{cita.nombre}</strong></div>
                <div><span>Reserva para</span><strong>{cita.paraQuien === "otra-persona" ? "Otra persona" : "Titular del perfil"}</strong></div>
                {cita.paraQuien === "otra-persona" && <>
                  <div><span>Fecha de nacimiento</span><strong>{cita.fechaNacimiento}</strong></div>
                  <div><span>Relación con el titular</span><strong>{cita.relacion}</strong></div>
                </>}
                <div><span>Correo</span><strong>{cita.correo}</strong></div>
                <div><span>Teléfono</span><strong>{cita.telefono}</strong></div>
                <div><span>RUT</span><strong>{cita.rut}</strong></div>
                <div><span>Previsión</span><strong>{cita.prevision}</strong></div>
              </div>
              <footer className="cita-tarjeta-pie">
                <p>La clínica debe confirmar la fecha y hora contigo.</p>
                <button className="cita-eliminar" type="button" disabled={idEliminando === cita.id} onClick={() => void eliminar(cita.id)}>
                  {idEliminando === cita.id ? "Eliminando..." : "Eliminar solicitud"}
                </button>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}