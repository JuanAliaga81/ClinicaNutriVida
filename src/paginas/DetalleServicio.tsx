import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerServicioApi, type Servicio } from "../datos/catalogo";
import "./DetalleServicio.css";

const pesos = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function DetalleServicio() {
  const { codigo } = useParams<{ codigo: string }>();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;

    async function cargarServicio() {
      setCargando(true);
      setError("");

      try {
        const dato = await obtenerServicioApi(codigo ?? "");

        if (vigente) {
          setServicio(dato);
        }
      } catch {
        if (vigente) {
          setError("No se pudo cargar el servicio. Intenta nuevamente.");
        }
      } finally {
        if (vigente) {
          setCargando(false);
        }
      }
    }

    void cargarServicio();

    return () => {
      vigente = false;
    };
  }, [codigo]);

  if (cargando) {
    return (
      <main className="container py-5">
        <p role="status">Cargando servicio...</p>
      </main>
    );
  }

  if (error || !servicio) {
    return (
      <main className="container py-5">
        <h1>{error ? "Error al cargar" : "Servicio no encontrado"}</h1>
        <p>{error || "El servicio que buscas no está disponible."}</p>
        <Link className="btn btn-outline-success" to="/servicios">
          Volver a servicios
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-4 py-lg-5 pagina-detalle-servicio">
      <Link className="detalle-servicio-volver" to="/servicios">
        ← Volver a servicios
      </Link>

      <article className="row g-4 g-lg-5 align-items-center mt-1">
        <div className="col-12 col-lg-6">
          <img
            className="detalle-servicio-imagen"
            src={servicio.imagen || "/img/Doctor.jpg"}
            alt={`Imagen de ${servicio.nombre}`}
          />
        </div>

        <div className="col-12 col-lg-6">
          <span className="badge rounded-pill text-bg-success mb-3">
            {servicio.tipo}
          </span>

          <h1>{servicio.nombre}</h1>
          <p className="detalle-servicio-descripcion">{servicio.descripcion}</p>

          <dl className="detalle-servicio-datos">
            <div>
              <dt>Duración</dt>
              <dd>{servicio.duracion || "Por confirmar"}</dd>
            </div>
            <div>
              <dt>Modalidad</dt>
              <dd>{servicio.modalidad || "Por confirmar"}</dd>
            </div>
            <div>
              <dt>Profesional</dt>
              <dd>{servicio.profesional || "Equipo NutriVida"}</dd>
            </div>
          </dl>

          <p className="detalle-servicio-precio">
            {pesos.format(servicio.precio)}
          </p>

          <div className="d-flex flex-wrap gap-2">
            <Link
              className="btn btn-success"
              to={`/agendar?servicio=${encodeURIComponent(servicio.codigo)}`}
            >
              Reserva tu hora
            </Link>

            <Link className="btn btn-outline-success" to="/servicios">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
