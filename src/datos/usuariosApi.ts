import { cabecerasConToken, guardarToken, type Usuario } from "./auth";

const API_USUARIOS = "http://localhost:8080/api/usuarios";

export type DatosRegistro = {
  nombre: string;
  rut: string;
  fechaNacimiento: string;
  sexo: string;
  correo: string;
  celular: string;
  contrasena: string;
};

export type UsuarioAutenticado = {
  idUsuario: number;
  rol: string;
  persona: {
    idPersona: number;
    nombre: string;
    rut: string;
    fechaNacimiento: string;
    sexo: string;
  };
  correo: string;
  celular: string;
};

async function leerRespuesta<T>(respuesta: Response): Promise<T> {
  const contenido = await respuesta.text();
  if (!respuesta.ok) {
    let mensaje = contenido || `Error HTTP ${respuesta.status}`;
    try {
      const detalle = JSON.parse(contenido) as { message?: string; error?: string };
      mensaje = detalle.message || detalle.error || mensaje;
    } catch {
      // El backend también puede responder un mensaje de texto simple.
    }
    throw new Error(mensaje);
  }
  return JSON.parse(contenido) as T;
}

export async function registrarUsuarioApi(datos: DatosRegistro): Promise<UsuarioAutenticado> {
  const respuesta = await fetch(`${API_USUARIOS}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return leerRespuesta<UsuarioAutenticado>(respuesta);
}

export async function iniciarSesionApi(correo: string, contrasena: string): Promise<UsuarioAutenticado> {
  const respuesta = await fetch(`${API_USUARIOS}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  });
  const resultado = await leerRespuesta<{ token: string; usuario: UsuarioAutenticado }>(respuesta);
  guardarToken(resultado.token);
  return resultado.usuario;
}

export function convertirUsuarioLocal(usuario: UsuarioAutenticado): Usuario {
  const rol = usuario.rol?.toUpperCase();
  return {
    nombre: usuario.persona.nombre,
    correo: usuario.correo,
    clave: "",
    rol: rol === "ADMINISTRADOR" ? "Administrador" : rol === "NUTRICIONISTA" ? "Nutricionista" : "Paciente",
    activo: true,
    idUsuario: usuario.idUsuario,
    idPersona: usuario.persona.idPersona,
    rut: usuario.persona.rut,
    fechaNacimiento: usuario.persona.fechaNacimiento,
    sexo: usuario.persona.sexo,
    celular: usuario.celular,
  };
}

type UsuarioListadoApi = {
  idUsuario: number;
  persona: { idPersona: number; nombre: string; rut: string; fechaNacimiento: string; sexo: string };
  correo: string;
  celular: string;
  rol: string;
};

export async function listarUsuariosAdminApi(): Promise<Usuario[]> {
  const respuesta = await fetch(API_USUARIOS, { headers: cabecerasConToken() });
  if (respuesta.status === 204) return [];
  const datos = await leerRespuesta<UsuarioListadoApi[]>(respuesta);
  return datos.map((usuario) => {
    const rol = usuario.rol?.toUpperCase();
    return {
      nombre: usuario.persona?.nombre || "Usuario NutriVida",
      correo: usuario.correo,
      clave: "",
      rol: rol === "ADMINISTRADOR" ? "Administrador" : rol === "NUTRICIONISTA" ? "Nutricionista" : "Paciente",
      activo: true,
      idUsuario: usuario.idUsuario,
      idPersona: usuario.persona?.idPersona,
      rut: usuario.persona?.rut,
      fechaNacimiento: usuario.persona?.fechaNacimiento,
      sexo: usuario.persona?.sexo,
      celular: usuario.celular,
    };
  });
}
