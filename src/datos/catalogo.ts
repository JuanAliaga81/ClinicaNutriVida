import catalogoBase from "./servicios.json";
import { cabecerasConToken } from "./auth";

export type Servicio = {
  codigo: string;
  tipo: string;
  nombre: string;
  duracion: string;
  modalidad: string;
  profesional: string;
  precio: number;
  descripcion: string;
  imagen?: string;
};

export type ServicioEntrada = Pick<
  Servicio,
  | "tipo"
  | "nombre"
  | "duracion"
  | "modalidad"
  | "profesional"
  | "precio"
  | "descripcion"
>;

type ServicioApi = {
  idServicio: number;
  tipoServicio: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  modalidad: string;
  profesional: string;
  precio: number;
};

const API_SERVICIOS = "http://localhost:8080/api/servicios";
const CLAVE = "serviciosNutriVida";

function adaptarServicio(servicio: ServicioApi): Servicio {
  return {
    codigo: String(servicio.idServicio),
    tipo: servicio.tipoServicio,
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    duracion: servicio.duracion,
    modalidad: servicio.modalidad,
    profesional: servicio.profesional,
    precio: Number(servicio.precio),
    imagen: imagenPorTipo(servicio.tipoServicio),
  };
}

function convertirEntrada(servicio: ServicioEntrada) {
  return {
    tipoServicio: servicio.tipo,
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    duracion: servicio.duracion || "No especificada",
    modalidad: servicio.modalidad,
    profesional: servicio.profesional,
    precio: servicio.precio,
  };
}

export async function listarServiciosApi(): Promise<Servicio[]> {
  const respuesta = await fetch(API_SERVICIOS);

  if (respuesta.status === 204) return [];
  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

  const datos: ServicioApi[] = await respuesta.json();
  return datos.map(adaptarServicio);
}

export async function crearServicioApi(
  servicio: ServicioEntrada,
): Promise<Servicio> {
  const respuesta = await fetch(API_SERVICIOS, {
    method: "POST",
    headers: cabecerasConToken({ "Content-Type": "application/json" }),
    body: JSON.stringify(convertirEntrada(servicio)),
  });

  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

  const creado: ServicioApi = await respuesta.json();
  return adaptarServicio(creado);
}

export async function actualizarServicioApi(
  id: string,
  servicio: ServicioEntrada,
): Promise<Servicio> {
  const respuesta = await fetch(`${API_SERVICIOS}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: cabecerasConToken({ "Content-Type": "application/json" }),
    body: JSON.stringify(convertirEntrada(servicio)),
  });

  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

  const actualizado: ServicioApi = await respuesta.json();
  return adaptarServicio(actualizado);
}

export async function eliminarServicioApi(id: string): Promise<void> {
  const respuesta = await fetch(`${API_SERVICIOS}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: cabecerasConToken(),
  });

  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
}

export function imagenPorTipo(tipo: string) {
  const categoria = tipo.toLowerCase();

  if (categoria.includes("plan")) return "/img/PlanPerdida.png";
  if (categoria.includes("evalu")) return "/img/Resultados_Reales.jpg";
  if (categoria.includes("taller")) return "/img/Taller.png";

  return "/img/Doctor.jpg";
}

// Se conservan para las pantallas que aún usan localStorage.
export const serviciosIniciales: Servicio[] = (catalogoBase as Servicio[]).map(
  (servicio) => ({
    ...servicio,
    duracion: servicio.duracion || "No especificada",
    imagen: imagenPorTipo(servicio.tipo),
  }),
);

export function listarServicios(): Servicio[] {
  try {
    const guardados = localStorage.getItem(CLAVE);
    if (guardados) return JSON.parse(guardados) as Servicio[];
  } catch {
    return serviciosIniciales;
  }

  return serviciosIniciales;
}

export function guardarServicios(servicios: Servicio[]) {
  localStorage.setItem(CLAVE, JSON.stringify(servicios));
  window.dispatchEvent(new Event("nutrivida-servicios"));
}

export async function obtenerServicioApi(
  codigo: string,
): Promise<Servicio | null> {
  const respuesta = await fetch(
    `${API_SERVICIOS}/${encodeURIComponent(codigo)}`,
  );

  if (respuesta.status === 404 || respuesta.status === 204) {
    return null;
  }

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  const dato: ServicioApi = await respuesta.json();
  return adaptarServicio(dato);
}
