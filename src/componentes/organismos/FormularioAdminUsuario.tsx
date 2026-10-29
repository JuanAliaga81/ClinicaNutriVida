import Selector from "../atomos/Selector";
import Input from "../atomos/Input";
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import CampoFormulario from '../moleculas/CampoFormulario';
import type { RolUsuario } from '../../datos/auth';
export type FormularioUsuario = { nombre: string; correo: string; clave: string; rol: RolUsuario };
type Props = {
  usuarioForm: FormularioUsuario;
  setUsuarioForm: Dispatch<SetStateAction<FormularioUsuario>>;
  usuarioEditando: string | null;
  guardarUsuario: (evento: FormEvent) => void;
  error: string;
  alCancelar: () => void;
  correoActual?: string;
};
const roles: RolUsuario[] = ['Administrador', 'Nutricionista', 'Paciente'];

export default function FormularioAdminUsuario({ usuarioForm, setUsuarioForm, usuarioEditando, guardarUsuario, error, alCancelar, correoActual }: Props) {
  return (
    <form onSubmit={guardarUsuario} noValidate><div className="row g-3">
            <CampoFormulario className="col-12 col-md-6" id="admin-nombre" etiqueta="Nombre completo"><Input id="admin-nombre" maxLength={100} value={usuarioForm.nombre} onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })} /></CampoFormulario>
            <CampoFormulario className="col-12 col-md-6" id="admin-correo" etiqueta="Correo electrónico"><Input id="admin-correo" type="email" value={usuarioForm.correo} onChange={(e) => setUsuarioForm({ ...usuarioForm, correo: e.target.value })} /></CampoFormulario>
            <CampoFormulario className="col-12 col-md-6" id="admin-clave" etiqueta={usuarioEditando ? 'Nueva contraseña (opcional)' : 'Contraseña (4 a 10 caracteres)'}><Input id="admin-clave" type="password" maxLength={10} value={usuarioForm.clave} onChange={(e) => setUsuarioForm({ ...usuarioForm, clave: e.target.value })} /></CampoFormulario>
            <CampoFormulario className="col-12 col-md-6" id="admin-rol" etiqueta="Rol"><Selector id="admin-rol" value={usuarioForm.rol} disabled={usuarioEditando?.toLowerCase() === correoActual?.toLowerCase()} onChange={(e) => setUsuarioForm({ ...usuarioForm, rol: e.target.value as RolUsuario })}>{roles.map((rol) => <option key={rol}>{rol}</option>)}</Selector></CampoFormulario>
          </div>{error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}<div className="admin-form-acciones"><button type="submit" className="admin-crear">{usuarioEditando ? 'Guardar cambios' : 'Crear usuario'}</button><button type="button" className="admin-cancelar" onClick={alCancelar}>Cancelar</button></div></form>
  );
}
