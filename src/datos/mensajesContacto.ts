export type MensajeContacto = {
  id: string;
  nombre: string;
  correo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
  conversacion: MensajeConversacion[];
};

export type MensajeConversacion = {
  id: string;
  autor: 'usuario' | 'admin';
  texto: string;
  fecha: string;
};

/** Crea una entrada al enviar un mensaje, fuera del renderizado de React. */
export function crearEntradaConversacion(
  autor: MensajeConversacion['autor'],
  texto: string,
): MensajeConversacion {
  const ahora = new Date();
  return {
    id: `CHAT-${ahora.getTime()}`,
    autor,
    texto: texto.trim(),
    fecha: ahora.toLocaleString('es-CL'),
  };
}

const CLAVE = 'mensajesContactoNutriVida';

export function listarMensajesContacto(): MensajeContacto[] {
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE) || '[]') as Array<Partial<MensajeContacto>>;
    return guardados.map((mensaje) => ({
      id: mensaje.id || `MSG-${Date.now()}`,
      nombre: mensaje.nombre || 'Usuario',
      correo: mensaje.correo || '',
      mensaje: mensaje.mensaje || '',
      fecha: mensaje.fecha || '',
      leido: mensaje.leido ?? false,
      conversacion: Array.isArray(mensaje.conversacion) && mensaje.conversacion.length > 0
        ? mensaje.conversacion
        : [{ id: `${mensaje.id || 'MSG'}-INICIAL`, autor: 'usuario', texto: mensaje.mensaje || '', fecha: mensaje.fecha || '' }],
    }));
  } catch {
    return [];
  }
}

export function guardarMensajesContacto(mensajes: MensajeContacto[]) {
  localStorage.setItem(CLAVE, JSON.stringify(mensajes));
  window.dispatchEvent(new Event('nutrivida-mensajes'));
}
