import AreaTexto from "../atomos/AreaTexto";
import Selector from "../atomos/Selector";
import Input from "../atomos/Input";
import type { ChangeEvent, FormEvent } from 'react';
import type { NuevaCita } from '../../datos/citas';
import CampoFormulario from '../moleculas/CampoFormulario';

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
            <Input id="paciente"  value={valores.paciente} onChange={campo('paciente')} />
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="correo" etiqueta="Correo electrónico" error={errores.correo}>
            <Input id="correo" type="email"  value={valores.correo} onChange={campo('correo')} />
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario id="nutricionista" etiqueta="Nutricionista preferido" error={errores.nutricionista}>
            <Selector id="nutricionista"  value={valores.nutricionista} onChange={campo('nutricionista')}>
              <option value="">Selecciona un profesional</option>
              {nutricionistas.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
            </Selector>
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-3">
          <CampoFormulario id="fecha" etiqueta="Fecha" error={errores.fecha}>
            <Input id="fecha" type="date"  value={valores.fecha} onChange={campo('fecha')} />
          </CampoFormulario>
        </div>
        <div className="col-12 col-md-3">
          <CampoFormulario id="hora" etiqueta="Hora preferida" error={errores.hora}>
            <Input id="hora" type="time"  value={valores.hora} onChange={campo('hora')} />
          </CampoFormulario>
        </div>
        <div className="col-12">
          <CampoFormulario id="motivo" etiqueta="Motivo de la consulta" error={errores.motivo}>
            <AreaTexto id="motivo"  rows={3} value={valores.motivo} onChange={campo('motivo')} />
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
