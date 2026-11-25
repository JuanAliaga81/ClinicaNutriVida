import { cabecerasConToken } from "./auth";

export type Blog = {
  id: string;
  titulo: string;
  imagen: string;
  alt: string;
  texto: string;
  fecha: string;
};

export type NuevoBlog = {
  titulo: string;
  texto: string;
  imagen: File;
  alt: string;
};

type BlogApi = {
  idBlog: number;
  titulo: string;
  descripcion: string;
  imagen: string;
};

const API = "http://localhost:8080";
const API_BLOGS = `${API}/api/blogs`;

function adaptarBlog(blog: BlogApi): Blog {
  const imagen = blog.imagen.startsWith("http") ? blog.imagen : `${API}${blog.imagen}`;
  return {
    id: String(blog.idBlog),
    titulo: blog.titulo,
    texto: blog.descripcion,
    imagen,
    alt: blog.titulo,
    fecha: "",
  };
}

export async function listarBlogsApi(): Promise<Blog[]> {
  const respuesta = await fetch(API_BLOGS);
  if (respuesta.status === 204) return [];
  if (!respuesta.ok) throw new Error(`No se pudieron cargar los blogs (HTTP ${respuesta.status}).`);
  const datos = (await respuesta.json()) as BlogApi[];
  return datos.map(adaptarBlog);
}

export async function crearBlogApi(datos: NuevoBlog): Promise<Blog> {
  const formulario = new FormData();
  formulario.append("titulo", datos.titulo);
  formulario.append("descripcion", datos.texto);
  formulario.append("imagen", datos.imagen);

  const respuesta = await fetch(API_BLOGS, { method: "POST", headers: cabecerasConToken(), body: formulario });
  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(detalle || `No se pudo publicar el blog (HTTP ${respuesta.status}).`);
  }
  return adaptarBlog((await respuesta.json()) as BlogApi);
}


