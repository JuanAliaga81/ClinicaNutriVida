import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarBlogsApi, type Blog } from "../datos/blogs";
import { obtenerUsuarioActual } from "../datos/auth";
import "./PaginasExtra.css";

export default function Blogs() {
  const [articulos, setArticulos] = useState<Blog[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const esAdministrador = obtenerUsuarioActual()?.rol === "Administrador";

  useEffect(() => {
    let vigente = true;
    listarBlogsApi()
      .then((datos) => { if (vigente) setArticulos(datos); })
      .catch((fallo: unknown) => {
        if (vigente) setError(fallo instanceof Error ? fallo.message : "No se pudieron cargar las publicaciones.");
      })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, []);

  return (
    <main className="pagina-extra container py-5">
      <header className="text-center mb-5">
        <p className="extra-eyebrow">Nutrición y bienestar</p>
        <h1>Consejos para una vida saludable</h1>
        <p className="lead">Artículos y recomendaciones del equipo NutriVida.</p>
        {esAdministrador && <Link className="btn btn-success mt-2" to="/admin">Administrar publicaciones</Link>}
      </header>
      {cargando ? (
        <p className="text-center" role="status">Cargando publicaciones...</p>
      ) : error ? (
        <p className="alert alert-danger text-center" role="alert">{error}</p>
      ) : articulos.length === 0 ? (
        <p className="alert alert-light border text-center">Pronto encontrarás nuevas publicaciones.</p>
      ) : (
        <div className="row g-4">
          {articulos.map((articulo) => (
            <article className="col-12 col-md-6" key={articulo.id}>
              <div className="card h-100 shadow-sm">
                <img className="card-img-top extra-blog-img" src={articulo.imagen} alt={articulo.alt} />
                <div className="card-body">
                  {articulo.fecha && <p className="extra-eyebrow">{articulo.fecha}</p>}
                  <h2 className="h4">{articulo.titulo}</h2>
                  <p className="mb-0">{articulo.texto}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
