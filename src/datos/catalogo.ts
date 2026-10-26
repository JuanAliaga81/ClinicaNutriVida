import catalogoBase from './servicios.json';

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

const CLAVE = 'serviciosNutriVida';

export const serviciosIniciales: Servicio[] = (catalogoBase as Servicio[]).map((servicio) => ({
  ...servicio,
  duracion: servicio.duracion || 'No especificada',
  imagen: servicio.imagen || imagenPorTipo(servicio.tipo),
}));

export function imagenPorTipo(tipo: string) {
  if (tipo.toLowerCase().includes('plan')) return '/img/PlanPerdida.png';
  if (tipo.toLowerCase().includes('evalu')) return '/img/Resultados_Reales.jpg';
  if (tipo.toLowerCase().includes('taller')) return '/img/Taller.png';
  return '/img/Doctor.jpg';
}

export function listarServicios(): Servicio[] {
  try {
    const guardados = localStorage.getItem(CLAVE);
    if (guardados) return (JSON.parse(guardados) as Servicio[]).map((servicio) => ({
      ...servicio,
      imagen: servicio.imagen || imagenPorTipo(servicio.tipo),
    }));
  } catch {
    return serviciosIniciales;
  }
  return serviciosIniciales;
}

export function guardarServicios(servicios: Servicio[]) {
  localStorage.setItem(CLAVE, JSON.stringify(servicios));
  window.dispatchEvent(new Event('nutrivida-servicios'));
}
