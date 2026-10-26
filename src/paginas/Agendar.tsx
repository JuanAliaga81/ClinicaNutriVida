import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from '../componentes/atomos/CampoFormulario';
import { guardarCitasLegadas, listarCitasLegadas, type CitaLegada } from '../datos/citasLegadas';
import './PaginasExtra.css';

type Datos = Omit<CitaLegada, 'id' | 'fechaRegistro'>;
const inicial: Datos = { nombre: '', rut: '', correo: '', telefono: '', servicio: '', fecha: '' };
const servicios = ['Primera Consulta', 'Plan Pérdida de Peso', 'Nutrición Deportiva', 'Taller Alimentación Saludable'];
function rutValido(valor: string) {
  const limpio = valor.replace(/[.\-\s]/g, '').toUpperCase(); if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1); let suma = 0; let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) { suma += Number(cuerpo[i]) * mult; mult = mult === 7 ? 2 : mult + 1; }
  const resto = 11 - (suma % 11); const dv = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === limpio.slice(-1);
}
const fechaLocal = () => { const hoy = new Date(); hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()); return hoy.toISOString().slice(0, 10); };

export default function Agendar() {
  const [datos, setDatos] = useState(inicial); const [error, setError] = useState(''); const navegar = useNavigate();
  const cambiar = (campo: keyof Datos, valor: string) => { setDatos((actual) => ({ ...actual, [campo]: valor })); setError(''); };
  function enviar(e: FormEvent) {
    e.preventDefault(); const rut = datos.rut.trim().toUpperCase().replace(/[.\-\s]/g, ''); const telefono = datos.telefono.replace(/[\s\-.]/g, '');
    if (!datos.nombre.trim() || datos.nombre.trim().length > 100) return setError('Ingresa tu nombre (máximo 100 caracteres).');
    if (!rutValido(rut)) return setError('Ingresa un RUT chileno válido, con cuerpo y dígito verificador.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) return setError('Ingresa un correo electrónico válido.');
    if (!/^9\d{8}$/.test(telefono)) return setError('Ingresa un celular chileno de 9 dígitos que comience con 9.');
    if (!datos.servicio) return setError('Selecciona un servicio.');
    if (!datos.fecha || datos.fecha < fechaLocal()) return setError('Selecciona una fecha de hoy o posterior.');
    const cita: CitaLegada = { ...datos, nombre: datos.nombre.trim(), rut, correo: datos.correo.trim(), telefono: `+56 ${telefono}`, id: Date.now(), fechaRegistro: new Date().toLocaleDateString('es-CL') };
    guardarCitasLegadas([...listarCitasLegadas(), cita]); sessionStorage.setItem('reservaNutriVida', JSON.stringify(cita)); navegar('/confirmacion');
  }
  return <main className="pagina-extra agendar-pagina container py-4">
    <section className="agendar-panel" aria-label="Solicitud de hora NutriVida">
      <aside className="agendar-info">
        <p className="agendar-etiqueta">ATENCIÓN NUTRICIONAL</p>
        <h1>Reserva tu hora</h1>
        <p className="agendar-intro">Cuéntanos qué necesitas y te ayudaremos a encontrar el servicio adecuado para ti.</p>
        <div className="agendar-pasos">
          <div><span>1</span><p>Completa tus datos y elige un servicio.</p></div>
          <div><span>2</span><p>Envía tu solicitud con una fecha tentativa.</p></div>
          <div><span>3</span><p>Te contactaremos para coordinar y confirmar la hora.</p></div>
        </div>
        <div className="agendar-contacto"><strong>¿Tienes dudas?</strong><a href="tel:+56912345678">+56 9 1234 5678</a><span>Av. Alemania 1234, Temuco</span></div>
        <div className="agendar-deco" aria-hidden="true">✳</div>
      </aside>

      <div className="agendar-contenido">
        <header className="agendar-cabecera"><p className="extra-eyebrow">Solicitud de atención</p><h2>Cuéntanos sobre ti</h2><p>Los campos son necesarios para coordinar tu hora.</p></header>
        <form onSubmit={enviar} noValidate>
          <div className="row gx-3 gy-1">
            <div className="col-12 col-md-6"><CampoFormulario id="agendar-nombre" etiqueta="Nombre completo"><input className="form-control agendar-input" id="agendar-nombre" maxLength={100} autoComplete="name" placeholder="Nombre y apellido" value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} /></CampoFormulario></div>
            <div className="col-12 col-md-6"><CampoFormulario id="agendar-rut" etiqueta="RUT"><input className="form-control agendar-input" id="agendar-rut" maxLength={12} placeholder="Sin puntos ni guion" value={datos.rut} onChange={(e) => cambiar('rut', e.target.value)} /></CampoFormulario></div>
            <div className="col-12 col-md-6"><CampoFormulario id="agendar-correo" etiqueta="Correo electrónico"><input className="form-control agendar-input" id="agendar-correo" type="email" autoComplete="email" placeholder="nombre@correo.cl" value={datos.correo} onChange={(e) => cambiar('correo', e.target.value)} /></CampoFormulario></div>
            <div className="col-12 col-md-6"><CampoFormulario id="agendar-telefono" etiqueta="Celular"><div className="input-group"><span className="input-group-text agendar-prefijo">+56</span><input className="form-control agendar-input" id="agendar-telefono" type="tel" autoComplete="tel-national" placeholder="9 1234 5678" value={datos.telefono} onChange={(e) => cambiar('telefono', e.target.value)} /></div></CampoFormulario></div>
            <div className="col-12 col-md-6"><CampoFormulario id="agendar-servicio" etiqueta="Servicio que necesitas"><select className="form-select agendar-input" id="agendar-servicio" value={datos.servicio} onChange={(e) => cambiar('servicio', e.target.value)}><option value="">Selecciona una opción</option>{servicios.map((s) => <option key={s}>{s}</option>)}</select></CampoFormulario></div>
            <div className="col-12 col-md-6"><CampoFormulario id="agendar-fecha" etiqueta="Fecha tentativa"><input className="form-control agendar-input" id="agendar-fecha" type="date" min={fechaLocal()} value={datos.fecha} onChange={(e) => cambiar('fecha', e.target.value)} /></CampoFormulario></div>
          </div>
          {error && <p className="alert alert-danger py-2" role="alert">{error}</p>}
          <div className="agendar-acciones"><button className="btn btn-success agendar-submit" type="submit">Enviar solicitud <span aria-hidden="true">→</span></button><Link to="/citas">Ver solicitudes</Link></div>
          <p className="agendar-nota">La hora queda pendiente de confirmación. Tus datos se guardan localmente en este navegador para esta demostración.</p>
        </form>
      </div>
    </section>
  </main>;
}
