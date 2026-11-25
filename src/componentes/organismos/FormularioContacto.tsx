import { useEffect, useState, type FormEvent } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import AreaTexto from "../atomos/AreaTexto";
import Selector from "../atomos/Selector";
import { obtenerUsuarioActual } from "../../datos/auth";
import { crearContactoApi, listarTiposAsuntoApi, type TipoAsuntoApi } from "../../datos/contactosApi";

type Campos = { tipoAsuntoId: string; mensaje: string };

export default function FormularioContacto() {
  const [campos, setCampos] = useState<Campos>({ tipoAsuntoId: "", mensaje: "" });
  const [tiposAsunto, setTiposAsunto] = useState<TipoAsuntoApi[]>([]);
  const [errores, setErrores] = useState<Partial<Campos>>({});
  const [errorEnvio, setErrorEnvio] = useState("");
  const [cargandoTipos, setCargandoTipos] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    let vigente = true;
    listarTiposAsuntoApi()
      .then((tipos) => { if (vigente) setTiposAsunto(tipos); })
      .catch(() => { if (vigente) setErrorEnvio("No se pudieron cargar los asuntos. Intenta nuevamente."); })
      .finally(() => { if (vigente) setCargandoTipos(false); });
    return () => { vigente = false; };
  }, []);

  function cambiar(campo: keyof Campos, valor: string) {
    setCampos((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actual) => ({ ...actual, [campo]: undefined }));
    setErrorEnvio("");
    setEnviado(false);
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorEnvio("");

    const usuario = obtenerUsuarioActual();
    if (!usuario?.activo || !usuario.idUsuario) {
      setErrorEnvio("Inicia sesión nuevamente para enviar tu mensaje.");
      return;
    }

    const nuevos: Partial<Campos> = {};
    const tipoAsunto = tiposAsunto.find((tipo) => String(tipo.idTipoAsunto) === campos.tipoAsuntoId);
    if (!tipoAsunto) nuevos.tipoAsuntoId = "Selecciona un asunto.";
    if (!campos.mensaje.trim()) nuevos.mensaje = "Escribe tu mensaje.";
    else if (campos.mensaje.trim().length > 500) nuevos.mensaje = "El mensaje no puede superar 500 caracteres.";

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      await crearContactoApi(usuario.idUsuario, tipoAsunto!.idTipoAsunto, campos.mensaje.trim());
      setEnviado(true);
      setCampos({ tipoAsuntoId: "", mensaje: "" });
    } catch (error) {
      setErrorEnvio(error instanceof Error ? error.message : "No se pudo enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <CampoFormulario className="contacto-campo" id="contacto-asunto" etiqueta="Asunto" error={errores.tipoAsuntoId}>
        <Selector
          id="contacto-asunto"
          className={`contacto-input ${errores.tipoAsuntoId ? "is-invalid" : ""}`}
          value={campos.tipoAsuntoId}
          onChange={(e) => cambiar("tipoAsuntoId", e.target.value)}
          aria-invalid={!!errores.tipoAsuntoId}
          aria-describedby={errores.tipoAsuntoId ? "contacto-asunto-error" : undefined}
          disabled={cargandoTipos || tiposAsunto.length === 0 || enviando}
        >
          <option value="">{cargandoTipos ? "Cargando asuntos..." : "Selecciona el motivo de tu mensaje"}</option>
          {tiposAsunto.map((tipo) => <option key={tipo.idTipoAsunto} value={tipo.idTipoAsunto}>{tipo.nombre}</option>)}
        </Selector>
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
          disabled={enviando}
        />
        <small className="d-block text-end">{campos.mensaje.length}/500</small>
      </CampoFormulario>

      {errorEnvio && <p className="alert alert-danger mt-3" role="alert">{errorEnvio}</p>}
      {enviado && <p className="alert alert-success mt-3" role="status">Tu mensaje quedó registrado. Puedes revisar la respuesta desde tu Perfil.</p>}
      <button className="btn btn-success contacto-submit" type="submit" disabled={enviando || cargandoTipos || tiposAsunto.length === 0}>
        {enviando ? "Enviando..." : <>Enviar mensaje <span aria-hidden="true">→</span></>}
      </button>
      <p className="contacto-nota">El mensaje quedará asociado a tu cuenta.</p>
    </form>
  );
}