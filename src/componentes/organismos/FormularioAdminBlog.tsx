import { useState, type FormEvent } from "react";
import Input from "../atomos/Input";
import AreaTexto from "../atomos/AreaTexto";
import CampoFormulario from "../moleculas/CampoFormulario";
import type { NuevoBlog } from "../../datos/blogs";

type Props = {
  alPublicar: (blog: NuevoBlog) => Promise<void>;
};

export default function FormularioAdminBlog({ alPublicar }: Props) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [alt, setAlt] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cargarImagen(archivo?: File) {
    if (!archivo) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type)) {
      setError("La imagen debe estar en formato PNG, JPG o WEBP.");
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError("La imagen debe pesar menos de 5 MB.");
      return;
    }
    setImagen(archivo);
    setVistaPrevia(URL.createObjectURL(archivo));
    setError("");
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const tituloLimpio = titulo.trim();
    const textoLimpio = texto.trim();
    const altLimpio = alt.trim();
    if (!tituloLimpio || tituloLimpio.length > 120) return setError("Escribe un título de hasta 120 caracteres.");
    if (!textoLimpio || textoLimpio.length > 3000) return setError("Escribe el contenido del blog (máximo 3.000 caracteres).");
    if (!imagen) return setError("Selecciona una imagen para el blog.");
    if (!altLimpio) return setError("Describe la imagen para que también sea accesible.");

    setGuardando(true);
    setError("");
    try {
      await alPublicar({ titulo: tituloLimpio, texto: textoLimpio, imagen, alt: altLimpio });
      setTitulo("");
      setTexto("");
      setAlt("");
      setImagen(null);
      setVistaPrevia("");
      const selector = document.getElementById("blog-imagen") as HTMLInputElement | null;
      if (selector) selector.value = "";
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : "No se pudo publicar el blog.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={(evento) => void enviar(evento)} noValidate>
      <div className="row g-3">
        <CampoFormulario className="col-12" id="blog-titulo" etiqueta="Título">
          <Input id="blog-titulo" maxLength={120} value={titulo} onChange={(evento) => setTitulo(evento.target.value)} />
        </CampoFormulario>
        <CampoFormulario className="col-12" id="blog-texto" etiqueta="Contenido">
          <AreaTexto id="blog-texto" rows={5} maxLength={3000} value={texto} onChange={(evento) => setTexto(evento.target.value)} />
        </CampoFormulario>
        <CampoFormulario className="col-12 col-md-6" id="blog-imagen" etiqueta="Imagen">
          <Input id="blog-imagen" type="file" accept="image/png,image/jpeg,image/webp" onChange={(evento) => cargarImagen(evento.target.files?.[0])} />
          <small className="text-secondary">PNG, JPG o WEBP, hasta 5 MB.</small>
        </CampoFormulario>
        <CampoFormulario className="col-12 col-md-6" id="blog-alt" etiqueta="Descripción de la imagen">
          <Input id="blog-alt" maxLength={180} value={alt} onChange={(evento) => setAlt(evento.target.value)} placeholder="Describe brevemente la imagen" />
        </CampoFormulario>
        {vistaPrevia && <div className="col-12"><img src={vistaPrevia} alt={alt || "Vista previa del blog"} className="admin-servicio-preview" /></div>}
      </div>
      {error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}
      <div className="admin-form-acciones">
        <button className="admin-crear" type="submit" disabled={guardando}>{guardando ? "Publicando..." : "Publicar blog"}</button>
      </div>
    </form>
  );
}
