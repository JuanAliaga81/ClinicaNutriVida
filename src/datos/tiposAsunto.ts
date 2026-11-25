export type TipoAsunto = {
  id: string;
  nombre: string;
};

// Valores fijos de interfaz mientras se integra el endpoint de tipo_asunto.
export const tiposAsunto: TipoAsunto[] = [
  { id: "1", nombre: "Consulta sobre servicios" },
  { id: "2", nombre: "Reserva o modificación de cita" },
  { id: "3", nombre: "Seguimiento nutricional" },
  { id: "4", nombre: "Pagos y precios" },
  { id: "5", nombre: "Reclamo o sugerencia" },
  { id: "6", nombre: "Otro" },
];
