import AreaTexto from "../atomos/AreaTexto";
import Selector from "../atomos/Selector";
import Input from "../atomos/Input";
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import CampoFormulario from '../moleculas/CampoFormulario';
import { useEffect, useRef, useState } from 'react';
import type { Servicio } from '../../datos/catalogo';
export type FormularioServicio = Omit<Servicio, 'codigo'>;
type Props = {
  servicioForm: FormularioServicio;
  setServicioForm: Dispatch<SetStateAction<FormularioServicio>>;
  servicioEditando: string | null;
  guardarServicio: (evento: FormEvent) => void;
  error: string;
  alCancelar: () => void;
  setError: (mensaje: string) => void;
};
const tiposServicio = ['Consulta', 'Plan especializado', 'Evaluación', 'Taller grupal', 'Taller'];
function optimizarImagen(archivo: File): Promise<string> {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onerror = () => rechazar(new Error('No se pudo leer la imagen.'));
    lector.onload = () => {
      const imagen = new Image();
      imagen.onerror = () => rechazar(new Error('El archivo no se pudo abrir como imagen.'));
      imagen.onload = () => {
        const escala = Math.min(1, 1100 / Math.max(imagen.width, imagen.height));
        const lienzo = document.createElement('canvas');
        lienzo.width = Math.round(imagen.width * escala);
        lienzo.height = Math.round(imagen.height * escala);
        const contexto = lienzo.getContext('2d');
        if (!contexto) { rechazar(new Error('No se pudo procesar la imagen.')); return; }
        contexto.fillStyle = '#fff';
        contexto.fillRect(0, 0, lienzo.width, lienzo.height);
        contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
        resolver(lienzo.toDataURL('image/jpeg', 0.78));
      };
      imagen.src = String(lector.result || '');
    };
    lector.readAsDataURL(archivo);
  });
}

export default function FormularioAdminServicio({ servicioForm, setServicioForm, servicioEditando, guardarServicio, error, alCancelar, setError }: Props) {
  const [procesando, setProcesando] = useState(false);
  const cargaActual = useRef(0);

  useEffect(() => () => { cargaActual.current += 1; }, []);

  async function cargarImagen(archivo?: File) {
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen.');
      return;
    }
    if (archivo.size > 8 * 1024 * 1024) {
      setError('La imagen original debe pesar menos de 8 MB.');
      return;
    }
    const carga = ++cargaActual.current;
    setError('');
    setProcesando(true);
    try {
      const imagen = await optimizarImagen(archivo);
      if (carga !== cargaActual.current) return;
      setServicioForm((actual) => ({ ...actual, imagen }));
    } catch {
      if (carga === cargaActual.current) setError('No se pudo procesar la imagen; prueba con otro archivo.');
    } finally {
      if (carga === cargaActual.current) setProcesando(false);
    }
  }

  return (
    <form onSubmit={(evento) => { if (procesando) { evento.preventDefault(); return; } guardarServicio(evento); }} noValidate><fieldset disabled={procesando} className="row g-3">
            <CampoFormulario className="col-12 col-md-6" id="servicio-nombre" etiqueta="Nombre del servicio"><Input id="servicio-nombre" maxLength={100} value={servicioForm.nombre} onChange={(e) => setServicioForm({ ...servicioForm, nombre: e.target.value })} /></CampoFormulario>
            <CampoFormulario className="col-12 col-md-6" id="servicio-tipo" etiqueta="Categoría"><Selector id="servicio-tipo" value={servicioForm.tipo} onChange={(e) => setServicioForm({ ...servicioForm, tipo: e.target.value })}>{tiposServicio.map((tipo) => <option key={tipo}>{tipo}</option>)}</Selector></CampoFormulario>
            <CampoFormulario className="col-12 col-md-4" id="servicio-precio" etiqueta="Precio (CLP)"><Input id="servicio-precio" type="number" min={1} step={1000} value={servicioForm.precio || ''} onChange={(e) => setServicioForm({ ...servicioForm, precio: Number(e.target.value) })} /></CampoFormulario>
            <CampoFormulario className="col-12 col-md-4" id="servicio-duracion" etiqueta="Duración"><Input id="servicio-duracion" placeholder="Ej. 45 min" value={servicioForm.duracion} onChange={(e) => setServicioForm({ ...servicioForm, duracion: e.target.value })} /></CampoFormulario>
            <CampoFormulario className="col-12 col-md-4" id="servicio-modalidad" etiqueta="Modalidad"><Selector id="servicio-modalidad" value={servicioForm.modalidad} onChange={(e) => setServicioForm({ ...servicioForm, modalidad: e.target.value })}><option>Presencial</option><option>Online (video)</option><option>Presencial u online</option><option>Presencial (grupo)</option></Selector></CampoFormulario>
            <CampoFormulario className="col-12 col-md-6" id="servicio-profesional" etiqueta="Profesional"><Input id="servicio-profesional" value={servicioForm.profesional} onChange={(e) => setServicioForm({ ...servicioForm, profesional: e.target.value })} /></CampoFormulario>
            <CampoFormulario className="col-12" id="servicio-descripcion" etiqueta="Descripción"><AreaTexto id="servicio-descripcion" rows={3} maxLength={500} value={servicioForm.descripcion} onChange={(e) => setServicioForm({ ...servicioForm, descripcion: e.target.value })} /></CampoFormulario>
            <CampoFormulario className="col-12" id="servicio-imagen" etiqueta="Imagen del servicio"><Input id="servicio-imagen" type="file" accept="image/*" onChange={(e) => { void cargarImagen(e.target.files?.[0]); }} /> <small className="text-secondary">Imágenes hasta 8 MB. Se optimiza el tamaño antes de guardarla. Si editas un servicio puedes conservar su imagen actual.</small></CampoFormulario>
            {servicioForm.imagen && <div className="col-12"><img className="admin-servicio-preview" src={servicioForm.imagen} alt="Vista previa del servicio" /></div>}
          </fieldset>{procesando && <p role="status">Procesando imagen…</p>}{error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}<div className="admin-form-acciones"><button type="submit" className="admin-crear" disabled={procesando}>{servicioEditando ? 'Guardar cambios' : 'Añadir servicio'}</button><button type="button" className="admin-cancelar" onClick={alCancelar}>Cancelar</button></div></form>
  );
}
