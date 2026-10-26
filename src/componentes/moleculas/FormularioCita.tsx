import type { ChangeEvent, FormEvent } from 'react';
import type { NuevaCita } from '../../datos/citas';
import CampoFormulario from '../atomos/CampoFormulario';

type FormularioCitaProps = {
  valores: NuevaCita;
  errores: Partial<Record<keyof NuevaCita, string>>;
  editando: boolean;
  alCambiar: (campo: keyof NuevaCita, valor: string) => void;
  alEnviar: (evento: FormEvent<HTMLFormElement>) => void;
  alCancelarEdicion: () => void;
};

const nutricionistas = [
  'Nut. Carolina Fuentes M.',
  'Nut. Rodrigo Sepúlveda A.',
  'Nut. Daniela Morales C.',
  'Nut. Felipe Araya R.',
];

export default function FormularioCita({
  valores,
  errores,
  editando,
  alCambiar,
  alEnviar,
  alCancelarEdicion,
}: FormularioCitaProps) {
  const campo = (nombre: keyof NuevaCita) =>
    (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      alCambiar(nombre, evento.target.value);

  return (
    <form className="reserva-formulario" onSubmit={alEnviar} noValidate>
      <h2 className="h4">{editando ? 'Editar solicitud' : 'Solicitar una hora'}</h2>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <CampoFormulario id="paciente" etiqueta="Nombre del paciente" error={errores.paciente}>
            <input id="paciente" className="form-control" value={valores.paciente} onChange={campo('paciente')} />
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="correo" etiqueta="Correo electrónico" error={errores.correo}>
            <input id="correo" type="email" className="form-control" value={valores.correo} onChange={campo('correo')} />
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="nutricionista" etiqueta="Nutricionista preferido" error={errores.nutricionista}>
            <select id="nutricionista" className="form-select" value={valores.nutricionista} onChange={campo('nutricionista')}>
              <option value="">Selecciona un profesional</option>
              {nutricionistas.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
            </select>
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-3">
          <CampoFormulario id="fecha" etiqueta="Fecha" error={errores.fecha}>
            <input id="fecha" type="date" className="form-control" value={valores.fecha} onChange={campo('fecha')} />
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-3">
          <CampoFormulario id="hora" etiqueta="Hora preferida" error={errores.hora}>
            <input id="hora" type="time" className="form-control" value={valores.hora} onChange={campo('hora')} />
          </CampoFormulario>
        </div>
        <div className="col-12">
          <CampoFormulario id="motivo" etiqueta="Motivo de la consulta" error={errores.motivo}>
            <textarea id="motivo" className="form-control" rows={3} value={valores.motivo} onChange={campo('motivo')} />
          </CampoFormulario>
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-success" type="submit">{editando ? 'Guardar cambios' : 'Enviar solicitud'}</button>
        {editando && <button className="btn btn-outline-secondary" type="button" onClick={alCancelarEdicion}>Cancelar edición</button>}
      </div>
    </form>
  );
}
