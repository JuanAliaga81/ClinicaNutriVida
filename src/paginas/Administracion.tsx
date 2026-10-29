import FormularioAdminServicio, { type FormularioServicio } from "../componentes/organismos/FormularioAdminServicio";
import FormularioAdminUsuario, { type FormularioUsuario } from "../componentes/organismos/FormularioAdminUsuario";
import ConversacionContacto from "../componentes/organismos/ConversacionContacto";
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  guardarUsuarios,
  iniciarSesion,
  listarUsuarios,
  obtenerUsuarioActual,
  type RolUsuario,
  type Usuario,
} from '../datos/auth';
import {
  crearEntradaConversacion,
  guardarMensajesContacto,
  listarMensajesContacto,
  type MensajeContacto,
} from '../datos/mensajesContacto';
import {
  guardarServicios,
  listarServicios,
  type Servicio,
} from '../datos/catalogo';
import './PaginasExtra.css';


const formularioUsuarioVacio: FormularioUsuario = { nombre: '', correo: '', clave: '', rol: 'Paciente' };
const formularioServicioVacio: FormularioServicio = {
  tipo: 'Consulta', nombre: '', duracion: '', modalidad: 'Presencial',
  profesional: 'Nutricionista', precio: 0, descripcion: '', imagen: '',
};
const roles: RolUsuario[] = ['Administrador', 'Nutricionista', 'Paciente'];
const CORREO_ADMIN_DEMO = 'admin@nutrivida.cl';


export default function Administracion() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => listarUsuarios());
  const [mensajes, setMensajes] = useState<MensajeContacto[]>(() => listarMensajesContacto());
  const [servicios, setServicios] = useState<Servicio[]>(() => listarServicios());
  const [actual, setActual] = useState<Usuario | null>(obtenerUsuarioActual);
  const [seccion, setSeccion] = useState<'usuarios' | 'mensajes' | 'servicios'>('usuarios');
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [usuarioForm, setUsuarioForm] = useState(formularioUsuarioVacio);
  const [usuarioEditando, setUsuarioEditando] = useState<string | null>(null);
  const [usuarioFormAbierto, setUsuarioFormAbierto] = useState(false);
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
    const actualizarMensajes = () => setMensajes(listarMensajesContacto());
    const actualizarServicios = () => setServicios(listarServicios());
    window.addEventListener('nutrivida-mensajes', actualizarMensajes);
    window.addEventListener('storage', actualizarMensajes);
    window.addEventListener('nutrivida-servicios', actualizarServicios);
    window.addEventListener('storage', actualizarServicios);
    return () => {
      window.removeEventListener('nutrivida-mensajes', actualizarMensajes);
      window.removeEventListener('storage', actualizarMensajes);
      window.removeEventListener('nutrivida-servicios', actualizarServicios);
      window.removeEventListener('storage', actualizarServicios);
    };
  }, []);

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es-CL');
    return usuarios.filter((usuario) => {
      const coincideTexto = `${usuario.nombre} ${usuario.correo}`.toLocaleLowerCase('es-CL').includes(texto);
      return coincideTexto && (filtroRol === 'Todos' || usuario.rol === filtroRol);
    });
  }, [usuarios, busqueda, filtroRol]);

  const activos = usuarios.filter((usuario) => usuario.activo).length;
  const adminsActivos = usuarios.filter((usuario) => usuario.rol === 'Administrador' && usuario.activo).length;
  const mensajesSinLeer = mensajes.filter((item) => !item.leido).length;

  function abrirNuevoUsuario() {
    setUsuarioEditando(null);
    setUsuarioForm(formularioUsuarioVacio);
    setUsuarioFormAbierto(true);
    setError(''); setMensaje('');
  }

  function editarUsuario(usuario: Usuario) {
    if (usuario.correo.toLowerCase() === CORREO_ADMIN_DEMO) {
      setMensaje('La cuenta de demostración está protegida y no se puede editar.');
      return;
    }
    setUsuarioEditando(usuario.correo);
    setUsuarioForm({ nombre: usuario.nombre, correo: usuario.correo, clave: '', rol: usuario.rol });
    setUsuarioFormAbierto(true);
    setError(''); setMensaje('');
  }

  function guardarUsuario(e: FormEvent) {
    e.preventDefault();
    const nombre = usuarioForm.nombre.trim();
    const correo = usuarioForm.correo.trim().toLowerCase();
    if (!nombre || nombre.length > 100) return setError('Ingresa un nombre de hasta 100 caracteres.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return setError('Ingresa un correo electrónico válido.');
    if (usuarios.some((usuario) => usuario.correo.toLowerCase() === correo && usuario.correo.toLowerCase() !== usuarioEditando?.toLowerCase())) {
      return setError('Ya existe una cuenta con ese correo.');
    }
    if (!usuarioEditando && (usuarioForm.clave.length < 4 || usuarioForm.clave.length > 10)) return setError('La contraseña debe tener entre 4 y 10 caracteres.');
    if (usuarioForm.clave && (usuarioForm.clave.length < 4 || usuarioForm.clave.length > 10)) return setError('La contraseña debe tener entre 4 y 10 caracteres.');
    if (usuarioEditando?.toLowerCase() === actual?.correo.toLowerCase() && usuarioForm.rol !== 'Administrador') return setError('No puedes quitarte tu propio rol de Administrador.');

    const actualizados = usuarioEditando
      ? usuarios.map((usuario) => usuario.correo.toLowerCase() === usuarioEditando.toLowerCase() ? {
          ...usuario, nombre, correo, rol: usuarioForm.rol, clave: usuarioForm.clave || usuario.clave,
        } : usuario)
      : [...usuarios, { nombre, correo, clave: usuarioForm.clave, rol: usuarioForm.rol, activo: true }];

    guardarUsuarios(actualizados);
    setUsuarios(actualizados);
    setUsuarioFormAbierto(false);
    setUsuarioEditando(null);
    setMensaje(usuarioEditando ? 'Los datos del usuario se actualizaron.' : 'La cuenta se creó correctamente.');
    if (usuarioEditando?.toLowerCase() === actual?.correo.toLowerCase()) {
      iniciarSesion(correo);
      setActual(actualizados.find((usuario) => usuario.correo.toLowerCase() === correo) ?? actual);
    }
  }

  function cambiarEstadoUsuario(usuario: Usuario) {
    if (usuario.correo.toLowerCase() === CORREO_ADMIN_DEMO) return setMensaje('La cuenta de demostración no se puede desactivar.');
    if (usuario.correo.toLowerCase() === actual?.correo.toLowerCase()) return setMensaje('No puedes desactivar la cuenta que estás usando.');
    if (usuario.activo && usuario.rol === 'Administrador' && adminsActivos <= 1) return setMensaje('Debe quedar al menos un Administrador activo.');
    const actualizados = usuarios.map((item) => item.correo === usuario.correo ? { ...item, activo: !item.activo } : item);
    guardarUsuarios(actualizados); setUsuarios(actualizados);
    setMensaje(usuario.activo ? 'La cuenta quedó desactivada.' : 'La cuenta volvió a activarse.');
  }

  function eliminarUsuario(usuario: Usuario) {
    if (usuario.correo.toLowerCase() === CORREO_ADMIN_DEMO) return setMensaje('La cuenta de demostración no se puede eliminar.');
    if (usuario.correo.toLowerCase() === actual?.correo.toLowerCase()) return setMensaje('No puedes eliminar la cuenta que estás usando.');
    if (usuario.rol === 'Administrador' && usuario.activo && adminsActivos <= 1) return setMensaje('Debe quedar al menos un Administrador activo.');
    if (!window.confirm(`¿Eliminar definitivamente la cuenta de ${usuario.nombre}?`)) return;
    const actualizados = usuarios.filter((item) => item.correo !== usuario.correo);
    guardarUsuarios(actualizados); setUsuarios(actualizados); setMensaje('La cuenta se eliminó.');
  }

  function marcarMensaje(id: string, leido: boolean) {
    const actualizados = mensajes.map((item) => item.id === id ? { ...item, leido } : item);
    guardarMensajesContacto(actualizados); setMensajes(actualizados);
  }

  function eliminarMensaje(item: MensajeContacto) {
    if (!window.confirm(`¿Eliminar el mensaje de ${item.nombre}?`)) return;
    const actualizados = mensajes.filter((mensajeActual) => mensajeActual.id !== item.id);
    guardarMensajesContacto(actualizados); setMensajes(actualizados);
  }

  function responderMensaje(item: MensajeContacto) {
    const texto = (respuestas[item.id] || '').trim();
    if (!texto) return;
    const respuesta = crearEntradaConversacion('admin', texto);
    const actualizados = mensajes.map((mensajeActual) => mensajeActual.id === item.id
      ? { ...mensajeActual, leido: true, conversacion: [...mensajeActual.conversacion, respuesta] }
      : mensajeActual);
    guardarMensajesContacto(actualizados); setMensajes(actualizados);
    setRespuestas((actuales) => ({ ...actuales, [item.id]: '' }));
  }

  function abrirNuevoServicio() {
    setServicioEditando(null); setServicioForm(formularioServicioVacio);
    setServicioFormAbierto(true); setError(''); setMensaje('');
  }

  function editarServicio(servicio: Servicio) {
    setServicioEditando(servicio.codigo); setServicioForm(servicio);
    setServicioFormAbierto(true); setError(''); setMensaje('');
  }

  function guardarServicio(e: FormEvent) {
    e.preventDefault();
    const nombre = servicioForm.nombre.trim();
    const descripcion = servicioForm.descripcion.trim();
    const precio = Number(servicioForm.precio);
    if (!nombre || nombre.length > 100) return setError('Escribe un nombre de hasta 100 caracteres.');
    if (!descripcion || descripcion.length > 500) return setError('Escribe una descripción de hasta 500 caracteres.');
    if (!Number.isFinite(precio) || precio <= 0) return setError('El precio debe ser mayor que cero.');
    const imagenExistente = servicioEditando ? servicios.find((servicio) => servicio.codigo === servicioEditando)?.imagen : '';
    const imagen = servicioForm.imagen || imagenExistente;
    if (!imagen) return setError('Selecciona una imagen para el servicio.');

    const campos: FormularioServicio = { ...servicioForm, nombre, descripcion, precio, imagen };
    const actualizados = servicioEditando
      ? servicios.map((servicio) => servicio.codigo === servicioEditando ? { ...campos, codigo: servicio.codigo } : servicio)
      : [...servicios, { ...campos, codigo: `NV-${Date.now()}` }];
    guardarServicios(actualizados); setServicios(actualizados);
    setServicioFormAbierto(false); setServicioEditando(null);
    setMensaje(servicioEditando ? 'El servicio se actualizó en el catálogo.' : 'El servicio se agregó al catálogo.');
  }

  function eliminarServicio(servicio: Servicio) {
    if (!window.confirm(`¿Eliminar “${servicio.nombre}” del catálogo?`)) return;
    const actualizados = servicios.filter((item) => item.codigo !== servicio.codigo);
    guardarServicios(actualizados); setServicios(actualizados); setMensaje('El servicio se eliminó del catálogo.');
  }

  if (!actual || !actual.activo || actual.rol !== 'Administrador') return <main className="pagina-extra container py-5" aria-live="polite">Verificando acceso…</main>;

  return (
    <main className="pagina-extra admin-pagina container py-5">
      <header className="admin-encabezado">
        <div><p className="extra-eyebrow">NUTRIVIDA · PANEL DE CONTROL</p><h1>Administración</h1><p>Gestiona usuarios, mensajes recibidos y servicios de la clínica.</p></div>
      </header>

      <nav className="admin-tabs" aria-label="Secciones de administración">
        <button className={seccion === 'usuarios' ? 'is-active' : ''} type="button" onClick={() => { setSeccion('usuarios'); setMensaje(''); }}>Usuarios</button>
        <button className={seccion === 'mensajes' ? 'is-active' : ''} type="button" onClick={() => { setSeccion('mensajes'); setMensaje(''); }}>Mensajes <span>{mensajesSinLeer}</span></button>
        <button className={seccion === 'servicios' ? 'is-active' : ''} type="button" onClick={() => { setSeccion('servicios'); setMensaje(''); }}>Servicios <span>{servicios.length}</span></button>
      </nav>

      {mensaje && <p className="alert alert-success admin-mensaje" role="status">{mensaje}</p>}

      {seccion === 'usuarios' && <>
        <header className="admin-seccion-cabecera"><div><h2>Usuarios del sistema</h2><p>Asigna roles y administra el acceso a NutriVida.</p></div><button className="admin-crear" type="button" onClick={abrirNuevoUsuario}>+ Crear usuario</button></header>
        <section className="admin-indicadores" aria-label="Resumen de usuarios">
          <article><span className="admin-indicador-icono">♙</span><div><strong>{usuarios.length}</strong><span>Usuarios registrados</span></div></article>
          <article><span className="admin-indicador-icono">✓</span><div><strong>{activos}</strong><span>Cuentas activas</span></div></article>
          <article><span className="admin-indicador-icono">◆</span><div><strong>{adminsActivos}</strong><span>Administradores activos</span></div></article>
        </section>
        {usuarioFormAbierto && <section className="admin-form-panel"><header><div><p className="extra-eyebrow">{usuarioEditando ? 'EDITAR CUENTA' : 'NUEVA CUENTA'}</p><h2>{usuarioEditando ? 'Actualizar usuario' : 'Crear usuario'}</h2></div><button type="button" className="admin-cerrar-form" onClick={() => setUsuarioFormAbierto(false)} aria-label="Cerrar formulario">×</button></header>
          <FormularioAdminUsuario usuarioForm={usuarioForm} setUsuarioForm={setUsuarioForm} usuarioEditando={usuarioEditando} guardarUsuario={guardarUsuario} error={error} alCancelar={() => setUsuarioFormAbierto(false)} correoActual={actual?.correo} />
        </section>}
        <section className="admin-listado-panel"><div className="admin-listado-cabecera"><div><h3>Directorio de usuarios</h3><p>Busca por nombre o correo y filtra por rol.</p></div><div className="admin-filtros"><label className="visually-hidden" htmlFor="admin-buscar">Buscar usuarios</label><input id="admin-buscar" className="form-control" type="search" placeholder="Nombre o correo" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /><label className="visually-hidden" htmlFor="admin-filtro-rol">Filtrar por rol</label><select id="admin-filtro-rol" className="form-select" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}><option>Todos</option>{roles.map((rol) => <option key={rol}>{rol}</option>)}</select></div></div>
          {visibles.length === 0 ? <p className="admin-sin-resultados">No hay usuarios que coincidan con la búsqueda.</p> : <div className="table-responsive"><table className="table admin-tabla align-middle mb-0"><thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th className="text-end">Acciones</th></tr></thead><tbody>{visibles.map((usuario) => { const demoProtegido = usuario.correo.toLowerCase() === CORREO_ADMIN_DEMO; return <tr key={usuario.correo}><td><strong>{usuario.nombre}</strong><small>{usuario.correo}</small>{demoProtegido && <small className="admin-protegido">Cuenta de demostración protegida</small>}</td><td><span className={`admin-rol admin-rol-${usuario.rol.toLowerCase()}`}>{usuario.rol}</span></td><td><span className={`admin-estado ${usuario.activo ? 'esta-activo' : 'esta-inactivo'}`}>{usuario.activo ? 'Activo' : 'Desactivado'}</span></td><td>{demoProtegido ? <span className="admin-protegido-accion">Protegida</span> : <div className="admin-acciones-fila"><button type="button" onClick={() => editarUsuario(usuario)}>Editar</button><button type="button" onClick={() => cambiarEstadoUsuario(usuario)}>{usuario.activo ? 'Desactivar' : 'Activar'}</button><button className="admin-eliminar" type="button" onClick={() => eliminarUsuario(usuario)}>Eliminar</button></div>}</td></tr>; })}</tbody></table></div>}
        </section>
      </>}

      {seccion === 'mensajes' && <section className="admin-seccion-panel"><header className="admin-seccion-cabecera"><div><h2>Mensajes de contacto</h2><p>{mensajesSinLeer} sin leer · {mensajes.length} en total</p></div></header>
        {mensajes.length === 0 ? <div className="admin-vacio"><span aria-hidden="true">✉</span><h3>No hay mensajes todavía</h3><p>Los mensajes enviados desde Contacto aparecerán aquí.</p></div> : <div className="admin-mensajes">{mensajes.map((item) => <article className={`admin-mensaje-card ${item.leido ? 'mensaje-leido' : ''}`} key={item.id}>
          <header><div><span className={`admin-mensaje-punto ${item.leido ? 'punto-leido' : ''}`} /><h3>{item.nombre}</h3><span className="admin-mensaje-correo">{item.correo}</span></div><time>{item.fecha}</time></header>
          <ConversacionContacto id={item.id} entradas={item.conversacion} nombreUsuario={item.nombre}
            respuesta={respuestas[item.id] || ''}
            alCambiar={(valor) => setRespuestas((actuales) => ({ ...actuales, [item.id]: valor }))}
            onEnviar={() => responderMensaje(item)} esAdministrador />
          <footer><button type="button" onClick={() => marcarMensaje(item.id, !item.leido)}>{item.leido ? 'Marcar como no leído' : 'Marcar como leído'}</button><button className="admin-eliminar" type="button" onClick={() => eliminarMensaje(item)}>Eliminar conversación</button></footer>
        </article>)}</div>}
      </section>}

      {seccion === 'servicios' && <section className="admin-seccion-panel"><header className="admin-seccion-cabecera"><div><h2>Catálogo de servicios</h2><p>Los cambios aquí se reflejan en la página Servicios.</p></div><button className="admin-crear" type="button" onClick={abrirNuevoServicio}>+ Añadir servicio</button></header>
        {servicioFormAbierto && <section className="admin-form-panel"><header><div><p className="extra-eyebrow">{servicioEditando ? 'EDITAR SERVICIO' : 'NUEVO SERVICIO'}</p><h3>{servicioEditando ? 'Actualizar servicio' : 'Añadir al catálogo'}</h3></div><button type="button" className="admin-cerrar-form" onClick={() => setServicioFormAbierto(false)} aria-label="Cerrar formulario">×</button></header>
          <FormularioAdminServicio key={servicioEditando || "nuevo"} servicioForm={servicioForm} setServicioForm={setServicioForm} servicioEditando={servicioEditando} guardarServicio={guardarServicio} error={error} alCancelar={() => setServicioFormAbierto(false)} setError={setError} />
        </section>}
        {servicios.length === 0 ? <div className="admin-vacio"><span aria-hidden="true">✳</span><h3>El catálogo está vacío</h3><p>Añade el primer servicio para mostrarlo en la página Servicios.</p></div> : <div className="admin-servicios-grid">{servicios.map((servicio) => <article className="admin-servicio-card" key={servicio.codigo}><img className="admin-servicio-imagen" src={servicio.imagen || '/img/Doctor.jpg'} alt={`Imagen de ${servicio.nombre}`} /><div className="admin-servicio-contenido"><div className="admin-servicio-top"><span className="admin-tipo-servicio">{servicio.tipo}</span><span className="admin-codigo-servicio">{servicio.codigo}</span></div><h3>{servicio.nombre}</h3><p>{servicio.descripcion}</p><div className="admin-servicio-meta"><span>{servicio.duracion}</span><span>{servicio.modalidad}</span></div><strong className="admin-precio">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(servicio.precio)}</strong><footer><button type="button" onClick={() => editarServicio(servicio)}>Editar</button><button className="admin-eliminar" type="button" onClick={() => eliminarServicio(servicio)}>Eliminar</button></footer></div></article>)}</div>}
      </section>}

      <p className="admin-aviso">Panel demostrativo: usuarios, mensajes y servicios se guardan localmente en este navegador.</p>
    </main>
  );
}
