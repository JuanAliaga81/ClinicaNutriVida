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

export function crearRepositorioCitas(iniciales: Cita[] = citasDemo) {
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
