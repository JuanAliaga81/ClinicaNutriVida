import { useEffect, useState } from "react";
import BusquedaServicios from "../atomos/BusquedaServicios";
import CardCatalogoServicio from "../moleculas/CardCatalogoServicio";
import { listarServiciosApi, type Servicio } from "../../datos/catalogo";
import "./CatalogoServicios.css";

export default function CatalogoServicios() {
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;

    async function cargarServicios() {
      setCargando(true);
      setError("");

      try {
        const datos = await listarServiciosApi();

        if (vigente) {
          setServicios(datos);
        }
      } catch {
        if (vigente) {
          setError("No se pudieron cargar los servicios. Intenta nuevamente.");
        }
      } finally {
        if (vigente) {
          setCargando(false);
        }
      }
    }

    void cargarServicios();

    return () => {
      vigente = false;
    };
  }, [intento]);

  const tipos = [
    "Todos",
    ...new Set(servicios.map((servicio) => servicio.tipo)),
  ];

  const visibles = servicios.filter((servicio) => {
    const coincideTipo = tipo === "Todos" || servicio.tipo === tipo;
    const texto =
      `${servicio.codigo} ${servicio.nombre} ${servicio.descripcion}`.toLocaleLowerCase(
        "es-CL",
      );

    return (
      coincideTipo && texto.includes(busqueda.trim().toLocaleLowerCase("es-CL"))
    );
  });

  return (
    <section className="catalogo-servicios" aria-label="Catálogo de servicios">
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-8">
          <BusquedaServicios valor={busqueda} alCambiar={setBusqueda} />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="tipo-servicio">
            Tipo de servicio
          </label>
          <select
            id="tipo-servicio"
            className="form-select"
            value={tipo}
            onChange={(evento) => setTipo(evento.target.value)}
          >
            {tipos.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando && <p role="status">Cargando servicios...</p>}

      {!cargando && error && (
        <div className="alert alert-danger" role="alert">
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={() => setIntento((actual) => actual + 1)}
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <>
          <p role="status">
            {visibles.length}{" "}
            {visibles.length === 1
              ? "servicio encontrado"
              : "servicios encontrados"}
          </p>

          {visibles.length === 0 ? (
            <p>No hay servicios que coincidan con tu búsqueda.</p>
          ) : (
            <div className="row g-3">
              {visibles.map((servicio) => (
                <CardCatalogoServicio
                  key={servicio.codigo}
                  servicio={servicio}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
