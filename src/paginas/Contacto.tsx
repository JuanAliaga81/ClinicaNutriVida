import { useState, type FormEvent } from 'react';
import { guardarMensajesContacto, listarMensajesContacto } from '../datos/mensajesContacto';
import './PaginasExtra.css';

type Campos = { nombre: string; correo: string; mensaje: string };
const vacio: Campos = { nombre: '', correo: '', mensaje: '' };

export default function Contacto() {
  const [campos, setCampos] = useState(vacio);
  const [errores, setErrores] = useState<Partial<Campos>>({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(campo: keyof Campos, valor: string) {
    setCampos((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actual) => ({ ...actual, [campo]: undefined }));
    setEnviado(false);
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos: Partial<Campos> = {};
    const correo = campos.correo.trim().toLowerCase();

    if (!campos.nombre.trim()) nuevos.nombre = 'Escribe tu nombre.';
    else if (campos.nombre.trim().length > 100) nuevos.nombre = 'El nombre no puede superar 100 caracteres.';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) nuevos.correo = 'Ingresa un correo electrónico válido.';
    else if (campos.correo.length > 100) nuevos.correo = 'El correo no puede superar 100 caracteres.';
    else if (!['duoc.cl', 'profesor.duoc.cl', 'gmail.com'].includes(correo.split('@')[1])) {
      nuevos.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }

    if (!campos.mensaje.trim()) nuevos.mensaje = 'Escribe tu mensaje.';
    else if (campos.mensaje.trim().length > 500) nuevos.mensaje = 'El mensaje no puede superar 500 caracteres.';

    setErrores(nuevos);
    if (Object.keys(nuevos).length === 0) {
      guardarMensajesContacto([
        {
          id: `MSG-${Date.now()}`,
          nombre: campos.nombre.trim(),
          correo,
          mensaje: campos.mensaje.trim(),
          fecha: new Date().toLocaleString('es-CL'),
          leido: false,
          conversacion: [{
            id: `MSG-${Date.now()}-INICIAL`,
            autor: 'usuario',
            texto: campos.mensaje.trim(),
            fecha: new Date().toLocaleString('es-CL'),
          }],
        },
        ...listarMensajesContacto(),
      ]);
      setEnviado(true);
      setCampos(vacio);
    }
  }

  return (
    <main className="pagina-extra contacto-pagina container py-5">
      <section className="contacto-panel" aria-label="Formulario de contacto NutriVida">
        <aside className="contacto-info">
          <p className="contacto-etiqueta">HABLEMOS</p>
          <h1>Estamos aquí para ayudarte.</h1>
          <p className="contacto-intro">
            Escríbenos tus dudas y nuestro equipo te orientará sobre nuestros servicios.
          </p>

          <div className="contacto-datos">
            <div><span aria-hidden="true">⌖</span><p><strong>Visítanos</strong>Av. Alemania 1234, Temuco</p></div>
            <div><span aria-hidden="true">☎</span><p><strong>Llámanos</strong><a href="tel:+56912345678">+56 9 1234 5678</a></p></div>
            <div><span aria-hidden="true">✉</span><p><strong>Escríbenos</strong><a href="mailto:contacto@nutrivida.cl">contacto@nutrivida.cl</a></p></div>
          </div>
          <p className="contacto-horario">Atención cercana y personalizada en cada etapa de tu proceso.</p>
          <div className="contacto-deco" aria-hidden="true">✳</div>
        </aside>

        <div className="contacto-formulario">
          <header className="contacto-cabecera">
            <p className="extra-eyebrow">Contacto</p>
            <h2>Envíanos un mensaje</h2>
            <p>Completa el formulario y cuéntanos cómo podemos ayudarte.</p>
          </header>

          <form onSubmit={enviar} noValidate>
            <div className="contacto-campo">
              <label htmlFor="contacto-nombre">Nombre completo</label>
              <input id="contacto-nombre" className={`form-control contacto-input ${errores.nombre ? 'is-invalid' : ''}`} maxLength={100} autoComplete="name" placeholder="Tu nombre y apellido" value={campos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
              {errores.nombre && <p className="contacto-error" role="alert">{errores.nombre}</p>}
            </div>

            <div className="contacto-campo">
              <label htmlFor="contacto-correo">Correo electrónico</label>
              <input id="contacto-correo" className={`form-control contacto-input ${errores.correo ? 'is-invalid' : ''}`} type="email" maxLength={100} autoComplete="email" placeholder="nombre@gmail.com" value={campos.correo} onChange={(e) => cambiar('correo', e.target.value)} />
              {errores.correo && <p className="contacto-error" role="alert">{errores.correo}</p>}
            </div>

            <div className="contacto-campo">
              <div className="contacto-label-fila"><label htmlFor="contacto-mensaje">Mensaje</label><span>{campos.mensaje.length}/500</span></div>
              <textarea id="contacto-mensaje" className={`form-control contacto-input contacto-textarea ${errores.mensaje ? 'is-invalid' : ''}`} rows={4} maxLength={500} placeholder="Escribe aquí tu consulta..." value={campos.mensaje} onChange={(e) => cambiar('mensaje', e.target.value)} />
              {errores.mensaje && <p className="contacto-error" role="alert">{errores.mensaje}</p>}
            </div>

            <button className="btn btn-success contacto-submit" type="submit">Enviar mensaje <span aria-hidden="true">→</span></button>
            {enviado && <p className="alert alert-success mt-3 mb-0" role="status">Tu mensaje quedó registrado. Gracias por contactarnos.</p>}
            <p className="contacto-nota">Formulario demostrativo: no envía correos a un servidor.</p>
          </form>
        </div>
      </section>
    </main>
  );
}
