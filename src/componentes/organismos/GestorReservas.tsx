import { useMemo, useState, type FormEvent } from 'react';
import { crearRepositorioCitas, type Cita, type NuevaCita } from '../../datos/citas';
import FormularioCita from '../moleculas/FormularioCita';

const formularioVacio: NuevaCita = {
  paciente: '',
  correo: '',
  nutricionista: '',
  fecha: '',
  hora: '',
  motivo: '',
};

function validar(datos: NuevaCita): Partial<Record<keyof NuevaCita, string>> {
  const errores: Partial<Record<keyof NuevaCita, string>> = {};
  if (!datos.paciente.trim()) errores.paciente = 'Ingresa el nombre del paciente.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) errores.correo = 'Ingresa un correo electrónico válido.';
  if (!datos.nutricionista) errores.nutricionista = 'Selecciona un nutricionista.';
  if (!datos.fecha) errores.fecha = 'Selecciona una fecha.';
  if (!datos.hora) errores.hora = 'Selecciona una hora.';
  if (datos.motivo.trim().length < 10) errores.motivo = 'Describe el motivo con al menos 10 caracteres.';
  return errores;
}

export default function GestorReservas() {
  const [repositorio] = useState(() => crearRepositorioCitas());
  const [citas, setCitas] = useState<Cita[]>(() => repositorio.listar());
  const [valores, setValores] = useState<NuevaCita>(formularioVacio);
  const [errores, setErrores] = useState<Partial<Record<keyof NuevaCita, string>>>({});
  const [editando, setEditando] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  const visibles = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase('es-CL');
    return citas.filter((cita) =>
      `${cita.paciente} ${cita.nutricionista} ${cita.motivo}`.toLocaleLowerCase('es-CL').includes(consulta),
    );
  }, [busqueda, citas]);

  function cambiar(campo: keyof NuevaCita, valor: string) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
    setMensaje('');
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    if (editando) {
      repositorio.actualizar(editando, valores);
      setMensaje('La solicitud se actualizó correctamente.');
    } else {
      repositorio.crear(valores);
      setMensaje('La solicitud se registró correctamente.');
    }
    setCitas(repositorio.listar());
    setValores(formularioVacio);
    setEditando(null);
  }

  function editar(cita: Cita) {
    setEditando(cita.id);
    setValores({
      paciente: cita.paciente,
      correo: cita.correo,
      nutricionista: cita.nutricionista,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
    });
    setErrores({});
    setMensaje('');
  }

  function cancelar(id: string) {
    repositorio.eliminar(id);
    setCitas(repositorio.listar());
    if (editando === id) {
      setEditando(null);
      setValores(formularioVacio);
    }
    setMensaje('La solicitud se canceló.');
  }

  return (
    <section className="gestor-reservas" aria-label="Gestión de reservas">
      <div className="reserva-panel">
        <FormularioCita
          valores={valores}
          errores={errores}
          editando={editando !== null}
          alCambiar={cambiar}
          alEnviar={enviar}
          alCancelarEdicion={() => {
            setEditando(null);
            setValores(formularioVacio);
            setErrores({});
          }}
        />
      </div>

      <div className="reserva-listado">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
          <div>
            <h2 className="h4 mb-1">Solicitudes de hora</h2>
            <p className="text-secondary mb-0">Puedes editar o cancelar una solicitud.</p>
          </div>
          <div className="reserva-busqueda">
            <label className="form-label" htmlFor="buscar-cita">Buscar solicitud</label>
            <input
              id="buscar-cita"
              className="form-control"
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Paciente, profesional o motivo"
            />
          </div>
        </div>

        {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}
        <p className="text-secondary" role="status">{visibles.length} {visibles.length === 1 ? 'solicitud' : 'solicitudes'}</p>
        {visibles.length === 0 ? (
          <p>No hay solicitudes que coincidan con la búsqueda.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr><th>Paciente</th><th>Nutricionista</th><th>Fecha y hora</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {visibles.map((cita) => (
                  <tr key={cita.id}>
                    <td>{cita.paciente}<small className="d-block text-secondary">{cita.correo}</small></td>
                    <td>{cita.nutricionista}</td>
                    <td>{cita.fecha} · {cita.hora}</td>
                    <td><span className="badge text-bg-success">{cita.estado}</span></td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-sm btn-outline-success" type="button" onClick={() => editar(cita)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => cancelar(cita.id)}>Cancelar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
