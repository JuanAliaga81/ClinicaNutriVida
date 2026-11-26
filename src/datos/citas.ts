import { cabecerasConToken } from "./auth";

export type Cita = {
  id: string;
  paciente: string;
  correo: string;
  nutricionista: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'Solicitada' | 'Confirmada';
};

export type NuevaCita = Omit<Cita, 'id' | 'estado'>;

/** Contrato del repositorio que aísla el CRUD de citas de los componentes. */
export interface RepositorioCitas {
  listar(): Cita[];
  crear(datos: NuevaCita): Cita;
  actualizar(id: string, cambios: NuevaCita): Cita | null;
  eliminar(id: string): boolean;
}

const citasDemo: Cita[] = [
  {
    id: 'CIT-001',
    paciente: 'Paciente de demostración',
    correo: 'demo@example.com',
    nutricionista: 'Nut. Carolina Fuentes M.',
    fecha: '2026-11-10',
    hora: '10:00',
    motivo: 'Evaluación nutricional inicial',
    estado: 'Solicitada',
  },
  {
    id: 'CIT-002',
    paciente: 'Paciente de seguimiento',
    correo: 'seguimiento@example.com',
    nutricionista: 'Nut. Rodrigo Sepúlveda A.',
    fecha: '2026-11-12',
    hora: '11:30',
    motivo: 'Control nutricional mensual',
    estado: 'Confirmada',
  },
];

/**
 * Implementación en memoria del patrón Repository:
 * los componentes usan este contrato sin manipular directamente el arreglo.
 */
export function crearRepositorioCitas(
  iniciales: Cita[] = citasDemo,
): RepositorioCitas {
  let citas = iniciales.map((cita) => ({ ...cita }));
  let siguienteNumero = citas.length + 1;

  return {
    listar(): Cita[] {
      return citas.map((cita) => ({ ...cita }));
    },

    crear(datos: NuevaCita): Cita {
      const nueva: Cita = {
        ...datos,
        id: `CIT-${String(siguienteNumero++).padStart(3, '0')}`,
        estado: 'Solicitada',
      };
      citas = [...citas, nueva];
      return { ...nueva };
    },

    actualizar(id: string, cambios: NuevaCita): Cita | null {
      const indice = citas.findIndex((cita) => cita.id === id);
      if (indice === -1) return null;

      citas = citas.map((cita) => cita.id === id ? { ...cita, ...cambios } : cita);
      return { ...citas[indice] };
    },

    eliminar(id: string): boolean {
      const cantidadAnterior = citas.length;
      citas = citas.filter((cita) => cita.id !== id);
      return citas.length < cantidadAnterior;
    },
  };
}

export type SolicitudCitaApi = {
  idUsuario: number;
  idPersona: number;
  idServicio: number;
  fecha: string;
  prevision: string;
};

export type CitaApi = SolicitudCitaApi & { idCita: number };

export async function listarCitasPorUsuarioApi(idUsuario: number): Promise<CitaApi[]> {
  const respuesta = await fetch(`http://localhost:8080/api/citas/usuario/${idUsuario}`, { headers: cabecerasConToken() });
  if (respuesta.status === 204) return [];
  if (!respuesta.ok) throw new Error(`No se pudieron cargar las citas (HTTP ${respuesta.status}).`);
  return (await respuesta.json()) as CitaApi[];
}

export async function eliminarCitaApi(idUsuario: number, idCita: number): Promise<void> {
  const respuesta = await fetch(`http://localhost:8080/api/citas/usuario/${idUsuario}/${idCita}`, { method: "DELETE", headers: cabecerasConToken() });
  if (!respuesta.ok) throw new Error(`No se pudo eliminar la cita (HTTP ${respuesta.status}).`);
}

export async function crearCitaApi(datos: SolicitudCitaApi): Promise<CitaApi> {
  const respuesta = await fetch(`http://localhost:8080/api/citas/usuario/${datos.idUsuario}`, {
    method: "POST",
    headers: cabecerasConToken({ "Content-Type": "application/json" }),
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(detalle || `No se pudo guardar la cita (HTTP ${respuesta.status}).`);
  }

  return (await respuesta.json()) as CitaApi;
}

