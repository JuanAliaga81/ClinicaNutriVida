export type RolUsuario = 'Administrador' | 'Nutricionista' | 'Paciente';
export type Usuario = {
  nombre: string;
  correo: string;
  clave: string;
  rol: RolUsuario;
  activo: boolean;
};
export type Sesion = { correo: string };

const USUARIOS = 'usuariosNutriVida';
const SESION = 'usuarioSesion';
const CUENTA_ADMIN_DEMO: Usuario = {
  nombre: 'Administración NutriVida',
  correo: 'admin@nutrivida.cl',
  clave: 'NutriVida1',
  rol: 'Administrador',
  activo: true,
};

function leer<T>(almacen: Storage, clave: string, inicial: T): T {
  try {
    const valor = almacen.getItem(clave);
    return valor ? JSON.parse(valor) as T : inicial;
  } catch {
    return inicial;
  }
}

export function listarUsuarios(): Usuario[] {
  const guardados = leer<Array<Partial<Usuario>>>(localStorage, USUARIOS, []);
  return guardados
    .filter((usuario) => Boolean(usuario.correo))
    .map((usuario) => ({
      nombre: usuario.nombre || 'Usuario NutriVida',
      correo: usuario.correo as string,
      clave: usuario.clave || '',
      rol: usuario.rol === 'Administrador' || usuario.rol === 'Nutricionista' ? usuario.rol : 'Paciente',
      activo: usuario.activo !== false,
    }));
}

export function inicializarAdminDemo() {
  const usuarios = listarUsuarios();
  const yaExiste = usuarios.some((usuario) => usuario.correo.trim().toLowerCase() === CUENTA_ADMIN_DEMO.correo);
  const actualizados = yaExiste
    ? usuarios.map((usuario) => usuario.correo.trim().toLowerCase() === CUENTA_ADMIN_DEMO.correo
        ? { ...usuario, ...CUENTA_ADMIN_DEMO }
        : usuario)
    : [...usuarios, CUENTA_ADMIN_DEMO];
  guardarUsuarios(actualizados);
}

export const obtenerSesion = () => leer<Sesion | null>(sessionStorage, SESION, null);
export const obtenerUsuarioActual = () => {
  const sesion = obtenerSesion();
  return sesion ? listarUsuarios().find((usuario) => usuario.correo.toLowerCase() === sesion.correo.toLowerCase()) ?? null : null;
};
export const guardarUsuarios = (usuarios: Usuario[]) => localStorage.setItem(USUARIOS, JSON.stringify(usuarios));
export const iniciarSesion = (correo: string) => {
  sessionStorage.setItem(SESION, JSON.stringify({ correo } satisfies Sesion));
  window.dispatchEvent(new Event('nutrivida-auth'));
};
export const cerrarSesion = () => {
  sessionStorage.removeItem(SESION);
  window.dispatchEvent(new Event('nutrivida-auth'));
};
