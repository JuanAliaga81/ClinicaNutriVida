import Input from "../atomos/Input";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { guardarUsuarios, listarUsuarios } from "../../datos/auth";
import CampoFormulario from "../moleculas/CampoFormulario";

export default function FormularioRegistro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const navegar = useNavigate();

  function enviar(e: FormEvent) {
    e.preventDefault();
    const mail = correo.trim().toLowerCase();

    if (!nombre.trim() || nombre.trim().length > 100) {
      setError("Ingresa tu nombre (máximo 100 caracteres).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError("Ingresa un correo válido.");
      return;
    }
    const usuarios = listarUsuarios();
    if (usuarios.some((u) => u.correo.toLowerCase() === mail)) {
      setError("Este correo ya está registrado.");
      return;
    }
    if (clave.length < 4 || clave.length > 10) {
      setError("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }
    if (clave !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    guardarUsuarios([
      ...usuarios,
      {
        nombre: nombre.trim(),
        correo: mail,
        clave,
        rol: "Paciente",
        activo: true,
      },
    ]);
    navegar("/login", { state: { registrado: true } });
  }

  return (
    <form onSubmit={enviar} noValidate>
              <CampoFormulario id="registro-nombre" etiqueta="Nombre completo">
                <Input
                  className="registro-input"
                  id="registro-nombre"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Tu nombre y apellido"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setError("");
                  }}
                />
              </CampoFormulario>
              <CampoFormulario
                id="registro-correo"
                etiqueta="Correo electrónico"
              >
                <Input
                  className="registro-input"
                  id="registro-correo"
                  type="email"
                  autoComplete="email"
                  maxLength={100}
                  placeholder="nombre@correo.cl"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    setError("");
                  }}
                />
              </CampoFormulario>
              <CampoFormulario
                id="registro-clave"
                etiqueta="Contraseña (4 a 10 caracteres)"
              >
                <Input
                  className="registro-input"
                  id="registro-clave"
                  type="password"
                  autoComplete="new-password"
                  maxLength={10}
                  placeholder="Crea una contraseña"
                  value={clave}
                  onChange={(e) => {
                    setClave(e.target.value);
                    setError("");
                  }}
                />
              </CampoFormulario>
              <CampoFormulario
                id="registro-confirmar"
                etiqueta="Confirmar contraseña"
              >
                <Input
                  className="registro-input"
                  id="registro-confirmar"
                  type="password"
                  autoComplete="new-password"
                  maxLength={10}
                  placeholder="Escríbela nuevamente"
                  value={confirmar}
                  onChange={(e) => {
                    setConfirmar(e.target.value);
                    setError("");
                  }}
                />
              </CampoFormulario>

              {error && (
                <p className="alert alert-danger registro-error" role="alert">
                  {error}
                </p>
              )}
              <button className="btn btn-success registro-submit" type="submit">
                Crear mi cuenta
              </button>
            </form>
  );
}
