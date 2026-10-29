import Selector from "../atomos/Selector";
import Input from "../atomos/Input";
import { listarServicios } from "../../datos/catalogo";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CampoFormulario from "../moleculas/CampoFormulario";
import {
  guardarCitasLegadas,
  listarCitasLegadas,
  type CitaLegada,
} from "../../datos/citasLegadas";

type Datos = Omit<CitaLegada, "id" | "fechaRegistro">;
const inicial: Datos = {
  nombre: "",
  rut: "",
  correo: "",
  telefono: "",
  servicio: "",
  fecha: "",
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

function limpiarCelular(valor: string) {
  return valor.replace(/\D/g, "").slice(0, 9);
}
const fechaLocal = () => {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  return hoy.toISOString().slice(0, 10);
};

export default function FormularioAgendamiento() {
  const [parametros] = useSearchParams();
  const [servicios] = useState(listarServicios);
  const [datos, setDatos] = useState(() => ({
    ...inicial,
    servicio: servicios.find((item) => item.codigo === parametros.get("servicio"))?.nombre || "",
  }));
  const [error, setError] = useState("");
  const navegar = useNavigate();
  const cambiar = (campo: keyof Datos, valor: string) => {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
    setError("");
  };
  function enviar(e: FormEvent) {
    e.preventDefault();
    const rut = datos.rut
      .trim()
      .toUpperCase()
      .replace(/[.\-\s]/g, "");
    const telefono = datos.telefono.replace(/\D/g, "");
    if (!datos.nombre.trim() || datos.nombre.trim().length > 100)
      return setError("Ingresa tu nombre (máximo 100 caracteres).");
    if (!rutValido(rut))
      return setError(
        "Ingresa un RUT chileno válido, con cuerpo y dígito verificador.",
      );
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim()))
      return setError("Ingresa un correo electrónico válido.");
    if (!/^9\d{8}$/.test(telefono))
      return setError(
        "Ingresa un celular chileno de 9 dígitos que comience con 9.",
      );
    if (!servicios.some((item) => item.nombre === datos.servicio)) return setError("Selecciona un servicio.");
    if (!datos.fecha || datos.fecha < fechaLocal())
      return setError("Selecciona una fecha de hoy o posterior.");
    const cita: CitaLegada = {
      ...datos,
      nombre: datos.nombre.trim(),
      rut,
      correo: datos.correo.trim().toLowerCase(),
      telefono: `+56 ${telefono}`,
      id: Date.now(),
      fechaRegistro: new Date().toLocaleDateString("es-CL"),
    };
    guardarCitasLegadas([...listarCitasLegadas(), cita]);
    sessionStorage.setItem("reservaNutriVida", JSON.stringify(cita));
    navegar("/confirmacion");
  }
  return (
    <form onSubmit={enviar} noValidate>
            <div className="row gx-3 gy-1">
              <div className="col-12 col-md-6">
                <CampoFormulario id="agendar-nombre" etiqueta="Nombre completo">
                  <Input
                    className="agendar-input"
                    id="agendar-nombre"
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Nombre y apellido"
                    value={datos.nombre}
                    onChange={(e) => cambiar("nombre", e.target.value)}
                  />
                </CampoFormulario>
              </div>
              <div className="col-12 col-md-6">
                <CampoFormulario id="agendar-rut" etiqueta="RUT">
                  <Input
                    className="agendar-input"
                    id="agendar-rut"
                    maxLength={9}
                    autoCapitalize="characters"
                    inputMode="text"
                    placeholder="Sin puntos ni guion (máx. 9)"
                    value={datos.rut}
                    onChange={(e) => cambiar("rut", limpiarRut(e.target.value))}
                  />
                </CampoFormulario>
              </div>
              <div className="col-12 col-md-6">
                <CampoFormulario
                  id="agendar-correo"
                  etiqueta="Correo electrónico"
                >
                  <Input
                    className="agendar-input"
                    id="agendar-correo"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@correo.cl"
                    value={datos.correo}
                    onChange={(e) => cambiar("correo", e.target.value)}
                  />
                </CampoFormulario>
              </div>
              <div className="col-12 col-md-6">
                <CampoFormulario id="agendar-telefono" etiqueta="Celular">
                  <div className="input-group">
                    <span className="input-group-text agendar-prefijo">
                      +56
                    </span>
                    <Input
                      className="agendar-input"
                      id="agendar-telefono"
                      type="tel"
                      inputMode="numeric"
                      maxLength={9}
                      autoComplete="tel-national"
                      placeholder="912345678"
                      value={datos.telefono}
                      onChange={(e) => cambiar("telefono", limpiarCelular(e.target.value))}
                    />
                  </div>
                </CampoFormulario>
              </div>
              <div className="col-12 col-md-6">
                <CampoFormulario
                  id="agendar-servicio"
                  etiqueta="Servicio que necesitas"
                >
                  <Selector
                    className="form-select agendar-input"
                    id="agendar-servicio"
                    value={datos.servicio}
                    onChange={(e) => cambiar("servicio", e.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    {servicios.map((s) => (
                      <option key={s.codigo} value={s.nombre}>{s.nombre}</option>
                    ))}
                  </Selector>
                </CampoFormulario>
              </div>
              <div className="col-12 col-md-6">
                <CampoFormulario id="agendar-fecha" etiqueta="Fecha tentativa">
                  <Input
                    className="agendar-input"
                    id="agendar-fecha"
                    type="date"
                    min={fechaLocal()}
                    value={datos.fecha}
                    onChange={(e) => cambiar("fecha", e.target.value)}
                  />
                </CampoFormulario>
              </div>
            </div>
            {error && (
              <p className="alert alert-danger py-2" role="alert">
                {error}
              </p>
            )}
            <div className="agendar-acciones">
              <button className="btn btn-success agendar-submit" type="submit">
                Enviar solicitud <span aria-hidden="true">→</span>
              </button>
              <Link to="/citas">Ver solicitudes</Link>
            </div>
            <p className="agendar-nota">
              La hora queda pendiente de confirmación. Tus datos se guardan
              localmente en este navegador para esta demostración.
            </p>
          </form>
  );
}
