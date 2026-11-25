import { cabecerasConToken, obtenerUsuarioActual } from "./auth";

const API = "http://localhost:8080/api";

export type PersonaApi = {
  idPersona: number;
  nombre: string;
  rut: string;
  fechaNacimiento: string;
  sexo: string;
};

export type UsuarioApi = {
  idUsuario: number;
  persona: PersonaApi;
  correo: string;
  celular: string;
};

export type UsuarioPersonaApi = {
  idUsuarioCarga: number;
  usuario: UsuarioApi;
  persona: PersonaApi;
  relacion: string;
};

export type CuentaReserva = {
  usuario: UsuarioApi;
  personas: UsuarioPersonaApi[];
};

async function respuestaJson<T>(respuesta: Response): Promise<T> {
  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(detalle || `Error HTTP ${respuesta.status}`);
  }
  return (await respuesta.json()) as T;
}

export async function cargarCuentaReserva(correo: string): Promise<CuentaReserva> {
  const usuarioActual = obtenerUsuarioActual();
  const idUsuario = usuarioActual?.idUsuario;
  const idPersona = usuarioActual?.idPersona;

  if (
    !usuarioActual ||
    usuarioActual.correo.trim().toLowerCase() !== correo.trim().toLowerCase() ||
    typeof idUsuario !== "number" ||
    typeof idPersona !== "number"
  ) {
    throw new Error("Inicia sesión con una cuenta registrada para reservar y consultar tus citas.");
  }

  const usuario: UsuarioApi = {
    idUsuario,
    persona: {
      idPersona,
      nombre: usuarioActual.nombre,
      rut: usuarioActual.rut || "",
      fechaNacimiento: usuarioActual.fechaNacimiento || "",
      sexo: usuarioActual.sexo || "",
    },
    correo: usuarioActual.correo,
    celular: usuarioActual.celular || "",
  };

  const respuestaVinculos = await fetch(`${API}/usuarios-personas`, {
    headers: cabecerasConToken(),
  });
  const vinculos = respuestaVinculos.status === 204
    ? []
    : await respuestaJson<UsuarioPersonaApi[]>(respuestaVinculos);

  return {
    usuario,
    personas: vinculos.filter(
      (vinculo) => vinculo.usuario?.idUsuario === usuario.idUsuario,
    ),
  };
}

export async function crearPersonaVinculada(
  usuario: UsuarioApi,
  persona: Omit<PersonaApi, "idPersona">,
  relacion: string,
): Promise<UsuarioPersonaApi> {
  const respuestaPersona = await fetch(`${API}/personas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(persona),
  });
  const personaCreada = await respuestaJson<PersonaApi>(respuestaPersona);

  try {
    const respuestaVinculo = await fetch(`${API}/usuarios-personas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: { idUsuario: usuario.idUsuario },
        persona: { idPersona: personaCreada.idPersona },
        relacion,
      }),
    });
    return await respuestaJson<UsuarioPersonaApi>(respuestaVinculo);
  } catch (error) {
    await fetch(`${API}/personas/${personaCreada.idPersona}`, {
      method: "DELETE",
    }).catch(() => undefined);
    throw error;
  }
}



