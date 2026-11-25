import Input from "../atomos/Input";
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { guardarUsuarioLocal, iniciarSesion } from "../../datos/auth";
import { convertirUsuarioLocal, iniciarSesionApi } from "../../datos/usuariosApi";
import CampoFormulario from "../moleculas/CampoFormulario";

function mensajeError(error: unknown) {
  if (!(error instanceof Error)) return "No se pudo iniciar sesión.";
  if (error.message === "Failed to fetch") return "No se pudo conectar con el servidor. Comprueba que el Gateway y Usuarios estén iniciados.";
  return error.message;
}

export default function FormularioLogin() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navegar = useNavigate();
  const location = useLocation();
  const registrado = (location.state as { registrado?: boolean } | null)?.registrado;

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalizado = correo.trim().toLowerCase();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizado)) return setError("Ingresa un correo electrónico válido.");
    if (!clave) return setError("Ingresa tu contraseña.");
    setEnviando(true);
    void iniciarSesionApi(normalizado, clave)
      .then((usuarioApi) => {
        guardarUsuarioLocal(convertirUsuarioLocal(usuarioApi));
        iniciarSesion(usuarioApi.correo);
        navegar(usuarioApi.rol?.toUpperCase() === "ADMINISTRADOR" ? "/admin" : "/perfil");
      })
      .catch((errorLogin: unknown) => setError(mensajeError(errorLogin)))
      .finally(() => setEnviando(false));
  }

  return (
    <form onSubmit={enviar} noValidate>
      {registrado && <p className="alert alert-success" role="status">Tu cuenta se creó. Ahora inicia sesión con tu correo y contraseña.</p>}
      <CampoFormulario id="login-correo" etiqueta="Correo electrónico">
        <Input className="login-input" id="login-correo" type="email" autoComplete="email" placeholder="nombre@correo.cl" value={correo} onChange={(e) => { setCorreo(e.target.value); setError(""); }} />
      </CampoFormulario>
      <CampoFormulario id="login-clave" etiqueta="Contraseña">
        <Input className="login-input" id="login-clave" type="password" autoComplete="current-password" maxLength={72} placeholder="Ingresa tu contraseña" value={clave} onChange={(e) => { setClave(e.target.value); setError(""); }} />
      </CampoFormulario>
      {error && <p className="alert alert-danger login-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-success login-submit" disabled={enviando}>{enviando ? "Iniciando sesión..." : "Ingresar a mi cuenta"}</button>
    </form>
  );
}
