import CampoFormulario from "../moleculas/CampoFormulario";
import AreaTexto from "../atomos/AreaTexto";
import Input from "../atomos/Input";
import { useState, type FormEvent } from "react";
import {
  guardarMensajesContacto,
  listarMensajesContacto,
} from "../../datos/mensajesContacto";

type Campos = { nombre: string; correo: string; mensaje: string };
const vacio: Campos = { nombre: "", correo: "", mensaje: "" };

export default function FormularioContacto() {
  const [campos, setCampos] = useState(vacio);
  const [errores, setErrores] = useState<Partial<Campos>>({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(campo: keyof Campos, valor: string) {
    setCampos((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actual) => ({ ...actual, [campo]: undefined }));
    setEnviado(false);
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos: Partial<Campos> = {};
    const correo = campos.correo.trim().toLowerCase();

    if (!campos.nombre.trim()) nuevos.nombre = "Escribe tu nombre.";
    else if (campos.nombre.trim().length > 100)
      nuevos.nombre = "El nombre no puede superar 100 caracteres.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
      nuevos.correo = "Ingresa un correo electrónico válido.";
    else if (campos.correo.length > 100)
      nuevos.correo = "El correo no puede superar 100 caracteres.";
    else if (
      !["duoc.cl", "profesor.duoc.cl", "gmail.com"].includes(
        correo.split("@")[1],
      )
    ) {
      nuevos.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }

    if (!campos.mensaje.trim()) nuevos.mensaje = "Escribe tu mensaje.";
    else if (campos.mensaje.trim().length > 500)
      nuevos.mensaje = "El mensaje no puede superar 500 caracteres.";

    setErrores(nuevos);
    if (Object.keys(nuevos).length === 0) {
      guardarMensajesContacto([
        {
          id: `MSG-${Date.now()}`,
          nombre: campos.nombre.trim(),
          correo,
          mensaje: campos.mensaje.trim(),
          fecha: new Date().toLocaleString("es-CL"),
          leido: false,
          conversacion: [
            {
              id: `MSG-${Date.now()}-INICIAL`,
              autor: "usuario",
              texto: campos.mensaje.trim(),
              fecha: new Date().toLocaleString("es-CL"),
            },
          ],
        },
        ...listarMensajesContacto(),
      ]);
      setEnviado(true);
      setCampos(vacio);
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
            <CampoFormulario className="contacto-campo" id="contacto-nombre" etiqueta="Nombre completo" error={errores.nombre}>
              <Input
                id="contacto-nombre"
                aria-invalid={!!errores.nombre}
                aria-describedby={errores.nombre ? "contacto-nombre-error" : undefined}
                className={`contacto-input ${errores.nombre ? "is-invalid" : ""}`}
                maxLength={100}
                autoComplete="name"
                placeholder="Tu nombre y apellido"
                value={campos.nombre}
                onChange={(e) => cambiar("nombre", e.target.value)}
              />
            </CampoFormulario>

            <CampoFormulario className="contacto-campo" id="contacto-correo" etiqueta="Correo electrónico" error={errores.correo}>
              <Input
                id="contacto-correo"
                aria-invalid={!!errores.correo}
                aria-describedby={errores.correo ? "contacto-correo-error" : undefined}
                className={`contacto-input ${errores.correo ? "is-invalid" : ""}`}
                type="email"
                maxLength={100}
                autoComplete="email"
                placeholder="nombre@gmail.com"
                value={campos.correo}
                onChange={(e) => cambiar("correo", e.target.value)}
              />
            </CampoFormulario>

            <CampoFormulario className="contacto-campo" id="contacto-mensaje" etiqueta="Mensaje" error={errores.mensaje}>
              <AreaTexto
                id="contacto-mensaje"
                aria-invalid={!!errores.mensaje}
                aria-describedby={errores.mensaje ? "contacto-mensaje-error" : undefined}
                className={`contacto-input contacto-textarea ${errores.mensaje ? "is-invalid" : ""}`}
                rows={4}
                maxLength={500}
                placeholder="Escribe aquí tu consulta..."
                value={campos.mensaje}
                onChange={(e) => cambiar("mensaje", e.target.value)}
              /><small className="d-block text-end">{campos.mensaje.length}/500</small>
            </CampoFormulario>

            <button className="btn btn-success contacto-submit" type="submit">
              Enviar mensaje <span aria-hidden="true">→</span>
            </button>
            {enviado && (
              <p className="alert alert-success mt-3 mb-0" role="status">
                Tu mensaje quedó registrado. Gracias por contactarnos.
              </p>
            )}
            <p className="contacto-nota">
              Formulario demostrativo: no envía correos a un servidor.
            </p>
          </form>
  );
}
