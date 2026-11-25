import { cabecerasConToken } from "./auth";
import type { MensajeContacto, MensajeConversacion } from "./mensajesContacto";

const API_CONTACTOS = "http://localhost:8080/api/contactos";

export type TipoAsuntoApi = {
  idTipoAsunto: number;
  nombre: string;
};

export type ContactoApi = {
  idContacto: number;
  idUsuario: number;
  idTipoAsunto: number;
  mensaje: string;
  respuesta: string | null;
  fechaCreacion: string;
};

async function leerRespuesta<T>(respuesta: Response): Promise<T> {
  const contenido = await respuesta.text();
  if (!respuesta.ok) {
    let mensaje = contenido || `Error HTTP ${respuesta.status}`;
    try {
      const detalle = JSON.parse(contenido) as { message?: string; error?: string };
      mensaje = detalle.message || detalle.error || mensaje;
    } catch {
      // La API también puede responder texto simple.
    }
    throw new Error(mensaje);
  }
  return contenido ? JSON.parse(contenido) as T : undefined as T;
}

function fechaLegible(fecha: string) {
  if (!fecha) return "";
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime()) ? fecha : valor.toLocaleString("es-CL");
}

export async function listarTiposAsuntoApi(): Promise<TipoAsuntoApi[]> {
  const respuesta = await fetch(`${API_CONTACTOS}/tipos-asunto`);
  return leerRespuesta<TipoAsuntoApi[]>(respuesta);
}

export async function crearContactoApi(
  idUsuario: number,
  idTipoAsunto: number,
  mensaje: string,
): Promise<ContactoApi> {
  const respuesta = await fetch(API_CONTACTOS, {
    method: "POST",
    headers: cabecerasConToken({ "Content-Type": "application/json" }),
    body: JSON.stringify({ idUsuario, idTipoAsunto, mensaje }),
  });
  return leerRespuesta<ContactoApi>(respuesta);
}

export async function listarContactosUsuarioApi(idUsuario: number): Promise<MensajeContacto[]> {
  const respuesta = await fetch(`${API_CONTACTOS}/usuario/${idUsuario}`, {
    headers: cabecerasConToken(),
  });
  const [datos, tipos] = await Promise.all([
    leerRespuesta<ContactoApi[]>(respuesta),
    listarTiposAsuntoApi(),
  ]);
  return datos.map((dato) => convertirContacto(dato, tipos));
}

export async function listarContactosAdminApi(): Promise<MensajeContacto[]> {
  const respuesta = await fetch(API_CONTACTOS, {
    headers: cabecerasConToken(),
  });
  if (respuesta.status === 204) return [];
  const [datos, tipos] = await Promise.all([
    leerRespuesta<ContactoApi[]>(respuesta),
    listarTiposAsuntoApi(),
  ]);
  return datos.map((dato) => convertirContacto(dato, tipos));
}

export async function responderContactoApi(idContacto: string, respuestaTexto: string): Promise<MensajeContacto> {
  const respuesta = await fetch(`${API_CONTACTOS}/${encodeURIComponent(idContacto)}/respuesta`, {
    method: "PUT",
    headers: cabecerasConToken({ "Content-Type": "application/json" }),
    body: JSON.stringify({ respuesta: respuestaTexto }),
  });
  const dato = await leerRespuesta<ContactoApi>(respuesta);
  const tipos = await listarTiposAsuntoApi();
  return convertirContacto(dato, tipos);
}

export async function eliminarContactoApi(idContacto: string): Promise<void> {
  const respuesta = await fetch(`${API_CONTACTOS}/${encodeURIComponent(idContacto)}`, {
    method: "DELETE",
    headers: cabecerasConToken(),
  });
  await leerRespuesta<unknown>(respuesta);
}

function convertirContacto(contacto: ContactoApi, tipos: TipoAsuntoApi[]): MensajeContacto {
  const fecha = fechaLegible(contacto.fechaCreacion);
  const tipoAsunto = tipos.find((tipo) => tipo.idTipoAsunto === contacto.idTipoAsunto);
  const conversacion: MensajeConversacion[] = [
    {
      id: `${contacto.idContacto}-mensaje`,
      autor: "usuario",
      texto: contacto.mensaje,
      fecha,
    },
  ];

  if (contacto.respuesta?.trim()) {
    conversacion.push({
      id: `${contacto.idContacto}-respuesta`,
      autor: "admin",
      texto: contacto.respuesta,
      fecha: "",
    });
  }

  return {
    id: String(contacto.idContacto),
    nombre: `Usuario #${contacto.idUsuario}`,
    correo: "Cuenta NutriVida",
    tipoAsuntoId: String(contacto.idTipoAsunto),
    asunto: tipoAsunto?.nombre || "Asunto de contacto",
    mensaje: contacto.mensaje,
    fecha,
    leido: Boolean(contacto.respuesta),
    conversacion,
  };
}