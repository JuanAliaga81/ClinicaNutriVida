export type RolUsuario = "Administrador" | "Nutricionista" | "Paciente";
export type Usuario = {
  nombre: string;
  correo: string;
  clave: string;
  rol: RolUsuario;
  activo: boolean;
  idUsuario?: number;
  idPersona?: number;
  rut?: string;
  fechaNacimiento?: string;
  sexo?: string;
  celular?: string;
};
export type Sesion = { correo: string };

const USUARIOS = "usuariosNutriVida";
const SESION = "usuarioSesion";
const TOKEN = "nutrividaToken";
const CUENTA_ADMIN_DEMO: Usuario = {
  nombre: "Administración NutriVida",
  correo: "admin@nutrivida.cl",
  clave: "NutriVida1",
  rol: "Administrador",
  activo: true,
};

function leer<T>(almacen: Storage, clave: string, inicial: T): T {
  try {
    const valor = almacen.getItem(clave);
    return valor ? (JSON.parse(valor) as T) : inicial;
  } catch {
    return inicial;
  }
}

export function listarUsuarios(): Usuario[] {
  const guardados = leer<Array<Partial<Usuario>>>(localStorage, USUARIOS, []);
  return guardados
    .filter((usuario) => Boolean(usuario.correo))
    .map((usuario) => ({
      nombre: usuario.nombre || "Usuario NutriVida",
      correo: usuario.correo as string,
      clave: usuario.clave || "",
      rol:
        usuario.rol === "Administrador" || usuario.rol === "Nutricionista"
          ? usuario.rol
          : "Paciente",
      activo: usuario.activo !== false,
      idUsuario: usuario.idUsuario,
      idPersona: usuario.idPersona,
      rut: usuario.rut,
      fechaNacimiento: usuario.fechaNacimiento,
      sexo: usuario.sexo,
      celular: usuario.celular,
    }));
}

export function inicializarAdminDemo() {
  const usuarios = listarUsuarios();
  const yaExiste = usuarios.some(
    (usuario) => usuario.correo.trim().toLowerCase() === CUENTA_ADMIN_DEMO.correo,
  );
  const actualizados = yaExiste
    ? usuarios.map((usuario) =>
        usuario.correo.trim().toLowerCase() === CUENTA_ADMIN_DEMO.correo
          ? { ...usuario, ...CUENTA_ADMIN_DEMO }
          : usuario,
      )
    : [...usuarios, CUENTA_ADMIN_DEMO];
  guardarUsuarios(actualizados);
}

export const obtenerSesion = () =>
  leer<Sesion | null>(sessionStorage, SESION, null);
export const obtenerUsuarioActual = () => {
  const sesion = obtenerSesion();
  return sesion
    ? (listarUsuarios().find(
        (usuario) => usuario.correo.toLowerCase() === sesion.correo.toLowerCase(),
      ) ?? null)
    : null;
};
export const guardarUsuarios = (usuarios: Usuario[]) =>
  localStorage.setItem(USUARIOS, JSON.stringify(usuarios));
export function guardarUsuarioLocal(usuario: Usuario) {
  const restantes = listarUsuarios().filter(
    (item) => item.correo.toLowerCase() !== usuario.correo.toLowerCase(),
  );
  guardarUsuarios([...restantes, usuario]);
}
export const iniciarSesion = (correo: string) => {
  sessionStorage.setItem(SESION, JSON.stringify({ correo } satisfies Sesion));
  window.dispatchEvent(new Event("nutrivida-auth"));
};
export const guardarToken = (token: string) => sessionStorage.setItem(TOKEN, token);
export const obtenerToken = () => sessionStorage.getItem(TOKEN);
export const cabecerasConToken = (cabeceras: HeadersInit = {}) => ({
  ...Object.fromEntries(new Headers(cabeceras).entries()),
  ...(obtenerToken() ? { Authorization: `Bearer ${obtenerToken()}` } : {}),
});
export const cerrarSesion = () => {
  sessionStorage.removeItem(TOKEN);
  sessionStorage.removeItem(SESION);
  window.dispatchEvent(new Event("nutrivida-auth"));
};
