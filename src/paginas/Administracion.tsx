import FormularioAdminServicio, { type FormularioServicio } from "../componentes/organismos/FormularioAdminServicio";
import FormularioAdminBlog from "../componentes/organismos/FormularioAdminBlog";
import ConversacionContacto from "../componentes/organismos/ConversacionContacto";
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarioActual, type Usuario } from '../datos/auth';
import { listarUsuariosAdminApi } from '../datos/usuariosApi';
import { type MensajeContacto } from '../datos/mensajesContacto';
import { eliminarContactoApi, listarContactosAdminApi, responderContactoApi } from '../datos/contactosApi';
import {
  actualizarServicioApi,
  crearServicioApi,
  eliminarServicioApi,
  listarServiciosApi,
  type Servicio,
} from '../datos/catalogo';
import { crearBlogApi, listarBlogsApi, type Blog, type NuevoBlog } from '../datos/blogs';
import './PaginasExtra.css';


const roles: Usuario['rol'][] = ['Administrador', 'Nutricionista', 'Paciente'];

const formularioServicioVacio: FormularioServicio = {
  tipo: 'Consulta', nombre: '', duracion: '', modalidad: 'Presencial',
  profesional: 'Nutricionista', precio: 0, descripcion: '', imagen: '',
};


export default function Administracion() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [errorUsuarios, setErrorUsuarios] = useState('');
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [cargandoMensajes, setCargandoMensajes] = useState(true);
  const [errorMensajes, setErrorMensajes] = useState('');
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargandoServicios, setCargandoServicios] = useState(true);
  const [errorServicios, setErrorServicios] = useState('');
  const [actual, setActual] = useState<Usuario | null>(obtenerUsuarioActual);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cargandoBlogs, setCargandoBlogs] = useState(true);
  const [errorBlogs, setErrorBlogs] = useState('');
  const [seccion, setSeccion] = useState<'usuarios' | 'mensajes' | 'servicios' | 'blogs'>('usuarios');
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [servicioForm, setServicioForm] = useState(formularioServicioVacio);
  const [servicioEditando, setServicioEditando] = useState<string | null>(null);
  const [servicioFormAbierto, setServicioFormAbierto] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const navegar = useNavigate();

  useEffect(() => {
    const usuario = actual;
    if (!usuario?.activo || usuario.rol !== 'Administrador') {
      navegar(usuario ? '/perfil' : '/login', { replace: true });
      return;
    }
  }, [navegar, actual]);

  useEffect(() => {
    let vigente = true;
    listarUsuariosAdminApi()
      .then((datos) => { if (vigente) setUsuarios(datos); })
      .catch((fallo: unknown) => {
        if (vigente) setErrorUsuarios(fallo instanceof Error ? fallo.message : 'No se pudieron cargar las cuentas.');
      })
      .finally(() => { if (vigente) setCargandoUsuarios(false); });
    return () => { vigente = false; };
  }, []);

  useEffect(() => {
    let vigente = true;
    listarContactosAdminApi()
      .then((datos) => { if (vigente) setMensajes(datos); })
      .catch((fallo: unknown) => {
        if (vigente) setErrorMensajes(fallo instanceof Error ? fallo.message : 'No se pudieron cargar los mensajes de Contacto.');
      })
      .finally(() => { if (vigente) setCargandoMensajes(false); });
    return () => { vigente = false; };
  }, []);

  useEffect(() => {
    let vigente = true;

    async function cargarServicios() {
      setCargandoServicios(true);
      setErrorServicios('');
      try {
        const datos = await listarServiciosApi();
        if (vigente) setServicios(datos);
      } catch {
        if (vigente) {
          setErrorServicios('No se pudieron cargar los servicios desde el backend.');
        }
      } finally {
        if (vigente) setCargandoServicios(false);
      }
    }

    void cargarServicios();
    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    let vigente = true;
    listarBlogsApi()
      .then((datos) => { if (vigente) setBlogs(datos); })
      .catch((fallo: unknown) => {
        if (vigente) setErrorBlogs(fallo instanceof Error ? fallo.message : 'No se pudieron cargar los blogs desde el backend.');
      })
      .finally(() => { if (vigente) setCargandoBlogs(false); });
    return () => { vigente = false; };
  }, []);

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es-CL');
    return usuarios.filter((usuario) => {
      const coincideTexto = `${usuario.nombre} ${usuario.correo}`.toLocaleLowerCase('es-CL').includes(texto);
      return coincideTexto && (filtroRol === 'Todos' || usuario.rol === filtroRol);
    });
  }, [usuarios, busqueda, filtroRol]);

  const nutricionistas = usuarios.filter((usuario) => usuario.rol === 'Nutricionista').length;
  const administradores = usuarios.filter((usuario) => usuario.rol === 'Administrador').length;
  const mensajesSinLeer = mensajes.filter((item) => !item.leido).length;

  async function eliminarMensaje(item: MensajeContacto) {
    if (!window.confirm(`¿Eliminar el mensaje de ${item.nombre}?`)) return;
    try {
      await eliminarContactoApi(item.id);
      setMensajes((actuales) => actuales.filter((mensajeActual) => mensajeActual.id !== item.id));
    } catch (fallo) {
      setErrorMensajes(fallo instanceof Error ? fallo.message : 'No se pudo eliminar el mensaje.');
    }
  }

  async function responderMensaje(item: MensajeContacto) {
    const texto = (respuestas[item.id] || '').trim();
    if (!texto) return;
    try {
      const actualizado = await responderContactoApi(item.id, texto);
      setMensajes((actuales) => actuales.map((mensajeActual) => mensajeActual.id === item.id ? actualizado : mensajeActual));
      setRespuestas((actuales) => ({ ...actuales, [item.id]: '' }));
    } catch (fallo) {
      setErrorMensajes(fallo instanceof Error ? fallo.message : 'No se pudo guardar la respuesta.');
    }
  }

  function abrirNuevoServicio() {
    setServicioEditando(null); setServicioForm(formularioServicioVacio);
    setServicioFormAbierto(true); setError(''); setMensaje('');
  }

  function editarServicio(servicio: Servicio) {
    setServicioEditando(servicio.codigo); setServicioForm(servicio);
    setServicioFormAbierto(true); setError(''); setMensaje('');
  }

  async function guardarServicio(e: FormEvent) {
    e.preventDefault();
    const nombre = servicioForm.nombre.trim();
    const descripcion = servicioForm.descripcion.trim();
    const duracion = servicioForm.duracion.trim();
    const modalidad = servicioForm.modalidad.trim();
    const profesional = servicioForm.profesional.trim();
    const precio = Number(servicioForm.precio);

    if (!nombre || nombre.length > 100) return setError('Escribe un nombre de hasta 100 caracteres.');
    if (!descripcion || descripcion.length > 500) return setError('Escribe una descripción de hasta 500 caracteres.');
    if (!duracion || duracion.length > 50) return setError('Ingresa una duración de hasta 50 caracteres.');
    if (!modalidad || modalidad.length > 50) return setError('Ingresa una modalidad de hasta 50 caracteres.');
    if (!profesional || profesional.length > 150) return setError('Ingresa el nombre del profesional.');
    if (!Number.isFinite(precio) || precio <= 0) return setError('El precio debe ser mayor que cero.');

    setError('');
    const datos = {
      tipo: servicioForm.tipo,
      nombre,
      descripcion,
      duracion,
      modalidad,
      profesional,
      precio,
    };

    try {
      const guardado = servicioEditando
        ? await actualizarServicioApi(servicioEditando, datos)
        : await crearServicioApi(datos);

      setServicios((actuales) =>
        servicioEditando
          ? actuales.map((servicio) =>
              servicio.codigo === guardado.codigo ? guardado : servicio,
            )
          : [...actuales, guardado],
      );
      setServicioFormAbierto(false);
      setServicioEditando(null);
      setMensaje(
        servicioEditando
          ? 'El servicio se actualizó en el catálogo.'
          : 'El servicio se agregó al catálogo.',
      );
    } catch {
      setError('No se pudo guardar el servicio en el backend.');
    }
  }

  async function eliminarServicio(servicio: Servicio) {
    if (!window.confirm(`¿Eliminar “${servicio.nombre}” del catálogo?`)) return;

    setErrorServicios('');
    try {
      await eliminarServicioApi(servicio.codigo);
      setServicios((actuales) =>
        actuales.filter((item) => item.codigo !== servicio.codigo),
      );
      setMensaje('El servicio se eliminó del catálogo.');
    } catch {
      setErrorServicios('No se pudo eliminar el servicio desde el backend.');
    }
  }
  async function publicarBlog(datos: NuevoBlog) {
    setErrorBlogs('');
    const nuevo = await crearBlogApi(datos);
    setBlogs((actuales) => [...actuales, nuevo]);
    setMensaje('El blog se publicó y ya aparece en la sección Blogs.');
  }

  if (!actual || !actual.activo || actual.rol !== 'Administrador') return <main className="pagina-extra container py-5" aria-live="polite">Verificando acceso…</main>;

  return (
    <main className="pagina-extra admin-pagina container py-5">
      <header className="admin-encabezado">
        <div><p className="extra-eyebrow">NUTRIVIDA · PANEL DE CONTROL</p><h1>Administración</h1><p>Consulta cuentas, mensajes, servicios y publicaciones de la clínica.</p></div>
      </header>

      <nav className="admin-tabs" aria-label="Secciones de administración">
        <button className={seccion === 'usuarios' ? 'is-active' : ''} type="button" onClick={() => { setSeccion('usuarios'); setMensaje(''); }}>Usuarios</button>
        <button className={seccion === 'mensajes' ? 'is-active' : ''} type="button" onClick={() => { setSeccion('mensajes'); setMensaje(''); }}>Mensajes <span>{mensajesSinLeer}</span></button>
        <button className={seccion === 'servicios' ? 'is-active' : ''} type="button" onClick={() => { setSeccion('servicios'); setMensaje(''); }}>Servicios <span>{servicios.length}</span></button>
        <button className={seccion === 'blogs' ? 'is-active' : ''} type="button" onClick={() => { setSeccion('blogs'); setMensaje(''); }}>Blogs <span>{blogs.length}</span></button>
      </nav>

      {mensaje && <p className="alert alert-success admin-mensaje" role="status">{mensaje}</p>}

      {seccion === 'usuarios' && <>
        <header className="admin-seccion-cabecera"><div><h2>Usuarios del sistema</h2><p>Cuentas registradas en la base de datos de NutriVida.</p></div></header>
        <section className="admin-indicadores" aria-label="Resumen de usuarios">
          <article><span className="admin-indicador-icono">♙</span><div><strong>{usuarios.length}</strong><span>Usuarios registrados</span></div></article>
          <article><span className="admin-indicador-icono">✓</span><div><strong>{nutricionistas}</strong><span>Nutricionistas</span></div></article>
          <article><span className="admin-indicador-icono">◆</span><div><strong>{administradores}</strong><span>Administradores</span></div></article>
        </section>
        <section className="admin-listado-panel"><div className="admin-listado-cabecera"><div><h3>Directorio de usuarios</h3><p>Busca por nombre o correo y filtra por rol.</p></div><div className="admin-filtros"><label className="visually-hidden" htmlFor="admin-buscar">Buscar usuarios</label><input id="admin-buscar" className="form-control" type="search" placeholder="Nombre o correo" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /><label className="visually-hidden" htmlFor="admin-filtro-rol">Filtrar por rol</label><select id="admin-filtro-rol" className="form-select" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}><option>Todos</option>{roles.map((rol) => <option key={rol}>{rol}</option>)}</select></div></div>
          {errorUsuarios && <p className="alert alert-danger" role="alert">{errorUsuarios}</p>}{cargandoUsuarios ? <p role="status">Cargando cuentas...</p> : visibles.length === 0 ? <p className="admin-sin-resultados">No hay usuarios que coincidan con la búsqueda.</p> : <div className="table-responsive"><table className="table admin-tabla align-middle mb-0"><thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th></tr></thead><tbody>{visibles.map((usuario) => { return <tr key={usuario.correo}><td><strong>{usuario.nombre}</strong><small>{usuario.correo}</small></td><td><span className={`admin-rol admin-rol-${usuario.rol.toLowerCase()}`}>{usuario.rol}</span></td><td><span className="admin-estado esta-activo">Registrada</span></td></tr>; })}</tbody></table></div>}
        </section>
      </>}

      {seccion === 'mensajes' && <section className="admin-seccion-panel"><header className="admin-seccion-cabecera"><div><h2>Mensajes de contacto</h2><p>{mensajesSinLeer} pendientes · {mensajes.length} en total</p></div></header>
        {errorMensajes && <p className="alert alert-danger" role="alert">{errorMensajes}</p>}
        {cargandoMensajes ? <p role="status">Cargando mensajes...</p> : mensajes.length === 0 ? <div className="admin-vacio"><span aria-hidden="true">✉</span><h3>No hay mensajes todavía</h3><p>Los mensajes enviados desde Contacto aparecerán aquí.</p></div> : <div className="admin-mensajes">{mensajes.map((item) => <article className={`admin-mensaje-card ${item.leido ? 'mensaje-leido' : ''}`} key={item.id}>
          <header><div><span className={`admin-mensaje-punto ${item.leido ? 'punto-leido' : ''}`} /><h3>{item.asunto}</h3><span className="admin-mensaje-correo">{item.nombre} · {item.correo}</span></div><time>{item.fecha}</time></header>
          <ConversacionContacto id={item.id} entradas={item.conversacion} nombreUsuario={item.nombre}
            respuesta={respuestas[item.id] || ''}
            alCambiar={(valor) => setRespuestas((actuales) => ({ ...actuales, [item.id]: valor }))}
            onEnviar={() => void responderMensaje(item)} esAdministrador />
          <footer><span>{item.leido ? 'Respuesta enviada' : 'Pendiente de respuesta'}</span><button className="admin-eliminar" type="button" onClick={() => void eliminarMensaje(item)}>Eliminar conversación</button></footer>
        </article>)}</div>}
      </section>}

      {seccion === 'servicios' && <section className="admin-seccion-panel"><header className="admin-seccion-cabecera"><div><h2>Catálogo de servicios</h2><p>Los cambios aquí se reflejan en la página Servicios.</p></div><button className="admin-crear" type="button" onClick={abrirNuevoServicio}>+ Añadir servicio</button></header>
        {servicioFormAbierto && <section className="admin-form-panel"><header><div><p className="extra-eyebrow">{servicioEditando ? 'EDITAR SERVICIO' : 'NUEVO SERVICIO'}</p><h3>{servicioEditando ? 'Actualizar servicio' : 'Añadir al catálogo'}</h3></div><button type="button" className="admin-cerrar-form" onClick={() => setServicioFormAbierto(false)} aria-label="Cerrar formulario">×</button></header>
          <FormularioAdminServicio key={servicioEditando || "nuevo"} servicioForm={servicioForm} setServicioForm={setServicioForm} servicioEditando={servicioEditando} guardarServicio={guardarServicio} error={error} alCancelar={() => setServicioFormAbierto(false)} />
        </section>}
        {cargandoServicios ? (
          <p role="status">Cargando servicios...</p>
        ) : servicios.length === 0 ? (
          errorServicios ? (
            <p className="alert alert-danger" role="alert">{errorServicios}</p>
          ) : (
            <div className="admin-vacio"><span aria-hidden="true">✳</span><h3>El catálogo está vacío</h3><p>Añade el primer servicio para mostrarlo en la página Servicios.</p></div>
          )
        ) : (
          <>
            {errorServicios && <p className="alert alert-danger" role="alert">{errorServicios}</p>}
            <div className="admin-servicios-grid">
              {servicios.map((servicio) => (
                <article className="admin-servicio-card" key={servicio.codigo}>
                  <img className="admin-servicio-imagen" src={servicio.imagen || '/img/Doctor.jpg'} alt={`Imagen de ${servicio.nombre}`} />
                  <div className="admin-servicio-contenido">
                    <div className="admin-servicio-top">
                      <span className="admin-tipo-servicio">{servicio.tipo}</span>
                      <span className="admin-codigo-servicio">{servicio.codigo}</span>
                    </div>
                    <h3>{servicio.nombre}</h3>
                    <p>{servicio.descripcion}</p>
                    <div className="admin-servicio-meta"><span>{servicio.duracion}</span><span>{servicio.modalidad}</span></div>
                    <strong className="admin-precio">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(servicio.precio)}
                    </strong>
                    <footer>
                      <button type="button" onClick={() => editarServicio(servicio)}>Editar</button>
                      <button className="admin-eliminar" type="button" onClick={() => void eliminarServicio(servicio)}>Eliminar</button>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>}

      {seccion === 'blogs' && <section className="admin-seccion-panel"><header className="admin-seccion-cabecera"><div><h2>Publicaciones del blog</h2><p>Los blogs publicados quedan visibles para quienes visitan NutriVida.</p></div></header>
        <section className="admin-form-panel"><header><div><p className="extra-eyebrow">NUEVA PUBLICACIÓN</p><h3>Crear blog</h3></div></header>
          <FormularioAdminBlog alPublicar={publicarBlog} />
        </section>
        {errorBlogs && <p className="alert alert-danger" role="alert">{errorBlogs}</p>}
        {cargandoBlogs ? <p role="status">Cargando publicaciones...</p> : blogs.length === 0 ? <div className="admin-vacio"><span aria-hidden="true">✎</span><h3>Aún no hay publicaciones</h3><p>Publica el primer artículo para que aparezca en la sección Blogs.</p></div> : <div className="row g-4 mt-2">{blogs.map((blog) => <article className="col-12 col-md-6 col-xl-4" key={blog.id}><div className="card h-100 shadow-sm"><img src={blog.imagen} alt={blog.alt} className="card-img-top" style={{ height: 190, objectFit: 'cover' }} /><div className="card-body"><p className="extra-eyebrow mb-2">PUBLICACIÓN</p><h3 className="h5">{blog.titulo}</h3><p className="mb-0">{blog.texto}</p></div></div></article>)}</div>}
      </section>}

      <p className="admin-aviso">Las cuentas, mensajes, servicios y publicaciones se consultan desde el backend.</p>
    </main>
  );
}


