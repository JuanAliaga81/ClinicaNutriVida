import Selector from "../atomos/Selector";
import Input from "../atomos/Input";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import { obtenerUsuarioActual } from "../../datos/auth";
import { listarServiciosApi, type Servicio } from "../../datos/catalogo";
import { crearCitaApi } from "../../datos/citas";
import {
  cargarCuentaReserva,
  crearPersonaVinculada,
  type CuentaReserva,
  type UsuarioPersonaApi,
} from "../../datos/personas";
import { type CitaLegada } from "../../datos/citasLegadas";

type ParaQuien = "titular" | "otra-persona";
type PersonaNueva = {
  nombre: string;
  rut: string;
  fechaNacimiento: string;
  sexo: string;
  relacion: string;
};

const nuevaPersonaVacia: PersonaNueva = {
  nombre: "",
  rut: "",
  fechaNacimiento: "",
  sexo: "",
  relacion: "",
};

function rutValido(valor: string) {
  const limpio = valor.replace(/[.\-\s]/g, "").toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1);
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const resto = 11 - (suma % 11);
  const dv = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === limpio.slice(-1);
}

function limpiarRut(valor: string) {
  return valor.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
}

function soloNueveDigitos(valor: string) {
  const digitos = valor.replace(/\D/g, "");
  const nacional = digitos.startsWith("56") && digitos.length === 11
    ? digitos.slice(2)
    : digitos;
  return nacional.slice(0, 9);
}

const fechaLocal = () => {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  return hoy.toISOString().slice(0, 10);
};

function mensajeError(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error al enviar la solicitud.";
}

export default function FormularioAgendamiento() {
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  const [cuenta, setCuenta] = useState<CuentaReserva | null>(null);
  const [personas, setPersonas] = useState<UsuarioPersonaApi[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");
  const [error, setError] = useState("");
  const [paraQuien, setParaQuien] = useState<ParaQuien>("titular");
  const [personaSeleccionada, setPersonaSeleccionada] = useState("");
  const [personaNueva, setPersonaNueva] = useState<PersonaNueva>(nuevaPersonaVacia);
  const [servicioCodigo, setServicioCodigo] = useState(parametros.get("servicio") || "");
  const [fecha, setFecha] = useState("");
  const [prevision, setPrevision] = useState("");

  useEffect(() => {
    let vigente = true;
    const usuarioLocal = obtenerUsuarioActual();

    async function cargarFormulario() {
      setCargando(true);
      setErrorCarga("");
      if (!usuarioLocal?.correo) {
        setErrorCarga("Inicia sesión para reservar y asociar la atención a tu cuenta.");
        setCargando(false);
        return;
      }

      try {
        const [datosCuenta, listaServicios] = await Promise.all([
          cargarCuentaReserva(usuarioLocal.correo),
          listarServiciosApi(),
        ]);
        if (!vigente) return;
        setCuenta(datosCuenta);
        setPersonas(datosCuenta.personas);
        setServicios(listaServicios);
        const servicioSolicitado = parametros.get("servicio") || "";
        setServicioCodigo(
          listaServicios.some((servicio) => servicio.codigo === servicioSolicitado)
            ? servicioSolicitado
            : "",
        );
      } catch (errorCarga) {
        if (vigente) setErrorCarga(mensajeError(errorCarga));
      } finally {
        if (vigente) setCargando(false);
      }
    }

    void cargarFormulario();
    return () => {
      vigente = false;
    };
  }, [parametros]);

  const personaVinculada = personas.find(
    (vinculo) => String(vinculo.persona.idPersona) === personaSeleccionada,
  );
  const esNuevaPersona = paraQuien === "otra-persona" && personaSeleccionada === "nueva";
  const personaActual = paraQuien === "titular"
    ? cuenta?.usuario.persona
    : personaVinculada?.persona;
  const nombreVisible = esNuevaPersona
    ? personaNueva.nombre
    : personaActual?.nombre || "";
  const rutVisible = esNuevaPersona ? personaNueva.rut : personaActual?.rut || "";
  const fechaNacimientoVisible = esNuevaPersona
    ? personaNueva.fechaNacimiento
    : personaActual?.fechaNacimiento || "";
  const sexoVisible = esNuevaPersona ? personaNueva.sexo : personaActual?.sexo || "";
  const relacionVisible = esNuevaPersona
    ? personaNueva.relacion
    : paraQuien === "titular"
      ? "Titular de la cuenta"
      : personaVinculada?.relacion || "";
  const celularContacto = soloNueveDigitos(cuenta?.usuario.celular || "");

  function actualizarPersona(campo: keyof PersonaNueva, valor: string) {
    setPersonaNueva((actual) => ({ ...actual, [campo]: valor }));
    setError("");
  }

  function seleccionarParaQuien(valor: ParaQuien) {
    setParaQuien(valor);
    setPersonaSeleccionada("");
    setPersonaNueva(nuevaPersonaVacia);
    setError("");
  }

  function seleccionarPersona(valor: string) {
    setPersonaSeleccionada(valor);
    setPersonaNueva(nuevaPersonaVacia);
    setError("");
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");

    if (!cuenta) return setError("No se pudo cargar la cuenta desde el backend.");
    if (paraQuien === "otra-persona" && !personaSeleccionada) {
      return setError("Selecciona una persona vinculada o elige añadir una persona.");
    }
    if (paraQuien === "otra-persona" && personaSeleccionada !== "nueva" && !personaVinculada) {
      return setError("La persona seleccionada ya no está vinculada a tu cuenta.");
    }

    const nombre = nombreVisible.trim();
    const rut = rutVisible.trim().toUpperCase().replace(/[.\-\s]/g, "");
    const correo = cuenta.usuario.correo.trim().toLowerCase();
    const telefono = celularContacto;
    const servicio = servicios.find((item) => item.codigo === servicioCodigo);

    if (!nombre || nombre.length > 150) return setError("El nombre debe tener entre 1 y 150 caracteres.");
    if (!rutValido(rut)) return setError("El RUT asociado debe ser válido.");
    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return setError("La cuenta no tiene un correo de contacto válido.");
    }
    if (!/^9\d{8}$/.test(telefono)) {
      return setError("La cuenta debe tener un celular chileno de 9 dígitos que comience con 9.");
    }
    if (!servicio) return setError("Selecciona un servicio disponible.");
    if (!fecha || fecha < fechaLocal()) return setError("Selecciona una fecha de hoy o posterior.");
    if (!prevision) return setError("Selecciona tu previsión.");

    if (esNuevaPersona) {
      if (!personaNueva.fechaNacimiento || personaNueva.fechaNacimiento > fechaLocal()) {
        return setError("Ingresa una fecha de nacimiento válida para la persona.");
      }
      if (!personaNueva.sexo) return setError("Selecciona el sexo de la persona.");
      if (!personaNueva.relacion.trim()) return setError("Indica la relación con el titular de la cuenta.");
      const rutDuplicado = rut === cuenta.usuario.persona.rut || personas.some(
        (vinculo) => vinculo.persona.rut.replace(/[.\-\s]/g, "").toUpperCase() === rut,
      );
      if (rutDuplicado) return setError("Ese RUT ya pertenece a una persona asociada. Selecciónala en la lista.");
    }

    setGuardando(true);
    let personaNuevaCreada = false;
    try {
      let idPersona = cuenta.usuario.persona.idPersona;
      let fechaNacimiento = cuenta.usuario.persona.fechaNacimiento;
      let relacion = "Titular de la cuenta";

      if (paraQuien === "otra-persona" && personaVinculada) {
        idPersona = personaVinculada.persona.idPersona;
        fechaNacimiento = personaVinculada.persona.fechaNacimiento;
        relacion = personaVinculada.relacion;
      } else if (esNuevaPersona) {
        const vinculo = await crearPersonaVinculada(
          cuenta.usuario,
          {
            nombre,
            rut,
            fechaNacimiento: personaNueva.fechaNacimiento,
            sexo: personaNueva.sexo,
          },
          personaNueva.relacion.trim(),
        );
        personaNuevaCreada = true;
        idPersona = vinculo.persona.idPersona;
        fechaNacimiento = vinculo.persona.fechaNacimiento;
        relacion = vinculo.relacion;
        setPersonas((actuales) => [...actuales, vinculo]);
        setPersonaSeleccionada(String(vinculo.persona.idPersona));
      }

      const citaGuardada = await crearCitaApi({
        idUsuario: cuenta.usuario.idUsuario,
        idPersona,
        idServicio: Number(servicio.codigo),
        fecha,
        prevision,
      });

      const citaLocal: CitaLegada = {
        id: citaGuardada.idCita,
        nombre,
        rut,
        correo,
        telefono: `+56 ${telefono}`,
        servicio: servicio.nombre,
        fecha,
        fechaRegistro: new Date().toLocaleDateString("es-CL"),
        paraQuien,
        fechaNacimiento,
        relacion,
        solicitanteCorreo: correo,
      };
      sessionStorage.setItem("reservaNutriVida", JSON.stringify(citaLocal));
      navegar("/confirmacion");
    } catch (errorEnvio) {
      const detalle = mensajeError(errorEnvio);
      setError(personaNuevaCreada
        ? `La persona quedó guardada en tu cuenta, pero no se pudo registrar la cita: ${detalle}`
        : `No se pudo guardar la solicitud: ${detalle}`,
      );
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p role="status">Cargando tus datos y servicios...</p>;
  }

  if (errorCarga) {
    return (
      <div>
        <p className="alert alert-danger" role="alert">{errorCarga}</p>
        {!obtenerUsuarioActual() && <Link className="btn btn-success" to="/login">Iniciar sesión</Link>}
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row gx-3 gy-1">
        <div className="col-12">
          <fieldset className="mb-2">
            <legend className="form-label fw-semibold">¿Para quién es la cita?</legend>
            <div className="d-flex flex-wrap gap-3">
              <label className="form-check d-flex align-items-center gap-2">
                <input className="form-check-input mt-0" type="radio" name="para-quien" value="titular" checked={paraQuien === "titular"} onChange={() => seleccionarParaQuien("titular")} />
                <span>Para mí</span>
              </label>
              <label className="form-check d-flex align-items-center gap-2">
                <input className="form-check-input mt-0" type="radio" name="para-quien" value="otra-persona" checked={paraQuien === "otra-persona"} onChange={() => seleccionarParaQuien("otra-persona")} />
                <span>Para otra persona</span>
              </label>
            </div>
          </fieldset>
        </div>

        {paraQuien === "otra-persona" && (
          <div className="col-12">
            <CampoFormulario id="agendar-persona-vinculada" etiqueta="Persona asociada a tu cuenta">
              <Selector className="agendar-input" id="agendar-persona-vinculada" value={personaSeleccionada} onChange={(e) => seleccionarPersona(e.target.value)}>
                <option value="">Selecciona una persona o añade una nueva</option>
                {personas.map((vinculo) => (
                  <option key={vinculo.idUsuarioCarga} value={vinculo.persona.idPersona}>
                    {vinculo.persona.nombre} · {vinculo.relacion}
                  </option>
                ))}
                <option value="nueva">Añadir persona</option>
              </Selector>
            </CampoFormulario>
          </div>
        )}

        {(paraQuien === "titular" || personaSeleccionada) && <>
          <div className="col-12 col-md-6">
            <CampoFormulario id="agendar-nombre" etiqueta={esNuevaPersona ? "Nombre completo de la persona" : "Nombre completo"}>
              <Input className="agendar-input" id="agendar-nombre" maxLength={150} autoComplete="name" placeholder="Nombre y apellido" value={nombreVisible} disabled={!esNuevaPersona} onChange={(e) => actualizarPersona("nombre", e.target.value)} />
            </CampoFormulario>
          </div>
          <div className="col-12 col-md-6">
            <CampoFormulario id="agendar-rut" etiqueta="RUT">
              <Input className="agendar-input" id="agendar-rut" maxLength={9} autoCapitalize="characters" inputMode="text" placeholder="Sin puntos ni guion (máx. 9)" value={rutVisible} disabled={!esNuevaPersona} onChange={(e) => actualizarPersona("rut", limpiarRut(e.target.value))} />
            </CampoFormulario>
          </div>
          <div className="col-12 col-md-6">
            <CampoFormulario id="agendar-correo" etiqueta="Correo de contacto">
              <Input className="agendar-input" id="agendar-correo" type="email" autoComplete="email" value={cuenta?.usuario.correo || ""} disabled />
            </CampoFormulario>
          </div>
          <div className="col-12 col-md-6">
            <CampoFormulario id="agendar-telefono" etiqueta="Celular de contacto">
              <div className="input-group">
                <span className="input-group-text agendar-prefijo">+56</span>
                <Input className="agendar-input" id="agendar-telefono" type="tel" inputMode="numeric" value={celularContacto} disabled />
              </div>
            </CampoFormulario>
          </div>

          {paraQuien === "otra-persona" && personaSeleccionada && (
            <>
              <div className="col-12 col-md-6">
                <CampoFormulario id="agendar-fecha-nacimiento" etiqueta="Fecha de nacimiento">
                  <Input className="agendar-input" id="agendar-fecha-nacimiento" type="date" max={fechaLocal()} value={fechaNacimientoVisible} disabled={!esNuevaPersona} onChange={(e) => actualizarPersona("fechaNacimiento", e.target.value)} />
                </CampoFormulario>
              </div>
              <div className="col-12 col-md-6">
                <CampoFormulario id="agendar-relacion" etiqueta="Relación con el titular del perfil">
                  {esNuevaPersona ? (
                    <Selector className="agendar-input" id="agendar-relacion" value={personaNueva.relacion} onChange={(e) => actualizarPersona("relacion", e.target.value)}>
                      <option value="">Selecciona una relación</option>
                      <option>Hijo/a</option>
                      <option>Madre o padre</option>
                      <option>Pareja</option>
                      <option>Otro familiar</option>
                      <option>Otra relación</option>
                    </Selector>
                  ) : (
                    <Input className="agendar-input" id="agendar-relacion" value={relacionVisible} disabled />
                  )}
                </CampoFormulario>
              </div>
              {esNuevaPersona ? (
                <div className="col-12 col-md-6">
                  <CampoFormulario id="agendar-sexo" etiqueta="Sexo">
                    <Selector className="agendar-input" id="agendar-sexo" value={personaNueva.sexo} onChange={(e) => actualizarPersona("sexo", e.target.value)}>
                      <option value="">Selecciona una opción</option>
                      <option value="F">Femenino</option>
                      <option value="M">Masculino</option>
                    </Selector>
                  </CampoFormulario>
                </div>
              ) : (
                <div className="col-12 col-md-6">
                  <CampoFormulario id="agendar-sexo" etiqueta="Sexo">
                    <Input className="agendar-input" id="agendar-sexo" value={sexoVisible === "F" ? "Femenino" : sexoVisible === "M" ? "Masculino" : sexoVisible} disabled />
                  </CampoFormulario>
                </div>
              )}
            </>
          )}
        </>}

        <div className="col-12 col-md-6">
          <CampoFormulario id="agendar-servicio" etiqueta="Servicio que necesitas">
            <Selector className="agendar-input" id="agendar-servicio" value={servicioCodigo} onChange={(e) => setServicioCodigo(e.target.value)}>
              <option value="">Selecciona una opción</option>
              {servicios.map((servicio) => <option key={servicio.codigo} value={servicio.codigo}>{servicio.nombre}</option>)}
            </Selector>
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="agendar-prevision" etiqueta="Previsión">
            <Selector className="agendar-input" id="agendar-prevision" value={prevision} onChange={(e) => setPrevision(e.target.value)}>
              <option value="">Selecciona una previsión</option>
              <option>Fonasa</option>
              <option>Isapre</option>
              <option>Particular</option>
              <option>Otra</option>
            </Selector>
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="agendar-fecha" etiqueta="Fecha tentativa">
            <Input className="agendar-input" id="agendar-fecha" type="date" min={fechaLocal()} value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </CampoFormulario>
        </div>
      </div>

      {error && <p className="alert alert-danger py-2" role="alert">{error}</p>}
      <div className="agendar-acciones">
        <button className="btn btn-success agendar-submit" type="submit" disabled={guardando}>
          {guardando ? "Enviando solicitud..." : <>Enviar solicitud <span aria-hidden="true">→</span></>}
        </button>
        <Link to="/citas">Ver solicitudes</Link>
      </div>
      <p className="agendar-nota">
        La hora queda pendiente de confirmación. Los datos de la persona se vinculan a tu cuenta y la solicitud se guarda en el sistema.
      </p>
    </form>
  );
}