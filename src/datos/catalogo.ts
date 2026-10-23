import catalogo from './servicios.json';

export type Servicio = {
  codigo: string;
  tipo: string;
  nombre: string;
  duracion: string;
  modalidad: string;
  profesional: string;
  precio: number;
  descripcion: string;
};

export const servicios: Servicio[] = catalogo.map((servicio) => ({
  ...servicio,
  duracion: servicio.duracion || 'No especificada',
}));

export const tiposServicio = ['Todos', ...new Set(servicios.map((servicio) => servicio.tipo))];
