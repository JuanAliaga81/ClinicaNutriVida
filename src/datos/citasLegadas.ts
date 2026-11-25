export type CitaLegada = {
  id: number;
  nombre: string;
  rut: string;
  correo: string;
  telefono: string;
  servicio: string;
  fecha: string;
  fechaRegistro: string;
  paraQuien?: 'titular' | 'otra-persona';
  fechaNacimiento?: string;
  relacion?: string;
  solicitanteCorreo?: string;
};

const CLAVE = 'citasNutriVida';
export function listarCitasLegadas(): CitaLegada[] {
  try { return JSON.parse(localStorage.getItem(CLAVE) || '[]') as CitaLegada[]; }
  catch { return []; }
}
export function guardarCitasLegadas(citas: CitaLegada[]) {
  localStorage.setItem(CLAVE, JSON.stringify(citas));
}
