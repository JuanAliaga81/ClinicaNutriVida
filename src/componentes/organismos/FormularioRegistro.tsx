import Input from "../atomos/Input";
import Selector from "../atomos/Selector";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { guardarUsuarioLocal } from "../../datos/auth";
import { registrarUsuarioApi } from "../../datos/usuariosApi";
import { convertirUsuarioLocal } from "../../datos/usuariosApi";
import CampoFormulario from "../moleculas/CampoFormulario";

function limpiarRut(valor: string) {
  return valor.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
}

function rutValido(valor: string) {
  if (!/^\d{7,8}[0-9K]$/.test(valor)) return false;
  const cuerpo = valor.slice(0, -1);
  let suma = 0;
  let multiplicador = 2;
  for (let indice = cuerpo.length - 1; indice >= 0; indice--) {
    suma += Number(cuerpo[indice]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  const verificador = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return valor.slice(-1) === verificador;
}

function fechaLocal() {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  return hoy.toISOString().slice(0, 10);
}

function mensajeError(error: unknown) {
  return error instanceof Error ? error.message : "No se pudo crear la cuenta.";
}

export default function FormularioRegistro() {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navegar = useNavigate();

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const mail = correo.trim().toLowerCase();
    const rutLimpio = rut.trim().toUpperCase();
    const telefono = celular.replace(/\D/g, "");

    if (!nombre.trim() || nombre.trim().length > 150) return setError("Ingresa tu nombre completo (máximo 150 caracteres).");
    if (!rutValido(rutLimpio)) return setError("Ingresa un RUT chileno válido, sin puntos ni guion.");
    if (!fechaNacimiento || fechaNacimiento > fechaLocal()) return setError("Ingresa una fecha de nacimiento válida.");
    if (sexo !== "F" && sexo !== "M") return setError("Selecciona el sexo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return setError("Ingresa un correo válido.");
    if (!/^9\d{8}$/.test(telefono)) return setError("Ingresa un celular de 9 dígitos que comience con 9.");
    if (clave.length < 4 || clave.length > 72) return setError("La contraseña debe tener entre 4 y 72 caracteres.");
    if (clave !== confirmar) return setError("Las contraseñas no coinciden.");

    setEnviando(true);
    try {
      const registrado = await registrarUsuarioApi({
        nombre: nombre.trim(),
        rut: rutLimpio,
        fechaNacimiento,
        sexo,
        correo: mail,
        celular: telefono,
        contrasena: clave,
      });
      guardarUsuarioLocal(convertirUsuarioLocal(registrado));
      navegar("/login", { state: { registrado: true } });
    } catch (errorRegistro) {
      setError(mensajeError(errorRegistro));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <CampoFormulario id="registro-nombre" etiqueta="Nombre completo">
        <Input className="registro-input" id="registro-nombre" autoComplete="name" maxLength={150} placeholder="Tu nombre y apellido" value={nombre} onChange={(e) => { setNombre(e.target.value); setError(""); }} />
      </CampoFormulario>
      <CampoFormulario id="registro-rut" etiqueta="RUT">
        <Input className="registro-input" id="registro-rut" maxLength={9} autoCapitalize="characters" placeholder="Sin puntos ni guion" value={rut} onChange={(e) => { setRut(limpiarRut(e.target.value)); setError(""); }} />
      </CampoFormulario>
      <CampoFormulario id="registro-nacimiento" etiqueta="Fecha de nacimiento">
        <Input className="registro-input" id="registro-nacimiento" type="date" max={fechaLocal()} value={fechaNacimiento} onChange={(e) => { setFechaNacimiento(e.target.value); setError(""); }} />
      </CampoFormulario>
      <CampoFormulario id="registro-sexo" etiqueta="Sexo">
        <Selector className="registro-input" id="registro-sexo" value={sexo} onChange={(e) => { setSexo(e.target.value); setError(""); }}>
          <option value="">Selecciona una opción</option>
          <option value="F">Femenino</option>
          <option value="M">Masculino</option>
        </Selector>
      </CampoFormulario>
      <CampoFormulario id="registro-correo" etiqueta="Correo electrónico">
        <Input className="registro-input" id="registro-correo" type="email" autoComplete="email" maxLength={150} placeholder="nombre@correo.cl" value={correo} onChange={(e) => { setCorreo(e.target.value); setError(""); }} />
      </CampoFormulario>
      <CampoFormulario id="registro-celular" etiqueta="Celular">
        <div className="input-group">
          <span className="input-group-text agendar-prefijo">+56</span>
          <Input className="registro-input" id="registro-celular" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={9} placeholder="912345678" value={celular} onChange={(e) => { setCelular(e.target.value.replace(/\D/g, "").slice(0, 9)); setError(""); }} />
        </div>
      </CampoFormulario>
      <CampoFormulario id="registro-clave" etiqueta="Contraseña (4 a 72 caracteres)">
        <Input className="registro-input" id="registro-clave" type="password" autoComplete="new-password" maxLength={72} placeholder="Crea una contraseña" value={clave} onChange={(e) => { setClave(e.target.value); setError(""); }} />
      </CampoFormulario>
      <CampoFormulario id="registro-confirmar" etiqueta="Confirmar contraseña">
        <Input className="registro-input" id="registro-confirmar" type="password" autoComplete="new-password" maxLength={72} placeholder="Escríbela nuevamente" value={confirmar} onChange={(e) => { setConfirmar(e.target.value); setError(""); }} />
      </CampoFormulario>
      {error && <p className="alert alert-danger registro-error" role="alert">{error}</p>}
      <button className="btn btn-success registro-submit" type="submit" disabled={enviando}>
        {enviando ? "Creando cuenta..." : "Crear mi cuenta"}
      </button>
    </form>
  );
}