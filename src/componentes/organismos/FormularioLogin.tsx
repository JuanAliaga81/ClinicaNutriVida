import Input from "../atomos/Input";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  inicializarAdminDemo,
  iniciarSesion,
  listarUsuarios,
} from "../../datos/auth";
import CampoFormulario from "../moleculas/CampoFormulario";

export default function FormularioLogin() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    inicializarAdminDemo();
  }, []);

  function enviar(e: FormEvent) {
    e.preventDefault();
    const normalizado = correo.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizado)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    if (clave.length < 4 || clave.length > 10) {
      setError("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }
    const usuario = listarUsuarios().find(
      (u) =>
        u.correo.toLowerCase() === normalizado && u.clave === clave && u.activo,
    );
    if (!usuario) {
      setError(
        "Correo o contraseña incorrectos. Si aún no tienes cuenta, regístrate.",
      );
      return;
    }
    iniciarSesion(usuario.correo);
    navegar(usuario.rol === "Administrador" ? "/admin" : "/perfil");
  }

  return (
    <form onSubmit={enviar} noValidate>
              <CampoFormulario id="login-correo" etiqueta="Correo electrónico">
                <Input
                  className="login-input"
                  id="login-correo"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.cl"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    setError("");
                  }}
                />
              </CampoFormulario>
              <CampoFormulario id="login-clave" etiqueta="Contraseña">
                <Input
                  className="login-input"
                  id="login-clave"
                  type="password"
                  autoComplete="current-password"
                  maxLength={10}
                  placeholder="Ingresa tu contraseña"
                  value={clave}
                  onChange={(e) => {
                    setClave(e.target.value);
                    setError("");
                  }}
                />
              </CampoFormulario>
              {error && (
                <p className="alert alert-danger login-error" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-success login-submit">
                Ingresar a mi cuenta
              </button>
            </form>
  );
}
