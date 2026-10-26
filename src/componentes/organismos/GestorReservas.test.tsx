import { useMemo, useState, type FormEvent } from 'react';
import {
  crearRepositorioCitas,
  type Cita,
  type NuevaCita,
} from '../../datos/citas';
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

  if (!datos.paciente.trim()) {
    errores.paciente = 'Ingresa el nombre del paciente.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
    errores.correo = 'Ingresa un correo electrónico válido.';
  }
  if (!datos.nutricionista) {
    errores.nutricionista = 'Selecciona un nutricionista.';
  }
  if (!datos.fecha) {
    errores.fecha = 'Selecciona una fecha.';
  }
  if (!datos.hora) {
    errores.hora = 'Selecciona una hora.';
  }
  if (datos.motivo.trim().length < 10) {
    errores.motivo = 'Describe el motivo con al menos 10 caracteres.';
  }

  return errores;
}

export default function GestorReservas() {
  const [repositorio] = useState(() => crearRepositorioCitas());
  const [citas, setCitas] = useState<Cita[]>(() => repositorio.listar());
  const [valores, setValores] = useState<NuevaCita>(formularioVacio);
  const [errores, setErrores] = useState<
    Partial<Record<keyof NuevaCita, string>>
  >({});
  const [editando, setEditando] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [vista, setVista] = useState<'formulario' | 'solicitudes'>('formulario');

  const visibles = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase('es-CL');

    return citas.filter((cita) =>
      `${cita.paciente} ${cita.nutricionista} ${cita.motivo}`
        .toLocaleLowerCase('es-CL')
        .includes(consulta),
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
    setVista('solicitudes');
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
    setVista('formulario');
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

  function cancelarEdicion() {
    setEditando(null);
    setValores(formularioVacio);
    setErrores({});
  }

  return (
    <section className="gestor-reservas" aria-label="Gestión de reservas">
      <div className="reserva-pestanas" role="tablist" aria-label="Opciones de reserva">
        <button
          type="button"
          role="tab"
          aria-selected={vista === 'formulario'}
          className={vista === 'formulario' ? 'activa' : ''}
          onClick={() => setVista('formulario')}
        >
          {editando ? 'Editar solicitud' : 'Solicitar hora'}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={vista === 'solicitudes'}
          className={vista === 'solicitudes' ? 'activa' : ''}
          onClick={() => setVista('solicitudes')}
        >
          Solicitudes ({citas.length})
        </button>
      </div>

      {vista === 'formulario' ? (
        <div className="reserva-vista" role="tabpanel">
          <div className="reserva-panel">
            <FormularioCita
              valores={valores}
              errores={errores}
              editando={editando !== null}
              alCambiar={cambiar}
              alEnviar={enviar}
              alCancelarEdicion={cancelarEdicion}
            />
          </div>
        </div>
      ) : (
        <div className="reserva-vista" role="tabpanel">
          <div className="reserva-listado">
            <div className="reserva-listado-encabezado">
              <div>
                <h2>Solicitudes de hora</h2>
                <p>Puedes editar o cancelar una solicitud.</p>
              </div>

              <div className="reserva-busqueda">
                <label htmlFor="buscar-cita">Buscar solicitud</label>
                <input
                  id="buscar-cita"
                  type="search"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder="Paciente, profesional o motivo"
                />
              </div>
            </div>

            {mensaje && <p className="reserva-mensaje" role="status">{mensaje}</p>}

            {visibles.length === 0 ? (
              <p>No hay solicitudes que coincidan con la búsqueda.</p>
            ) : (
              <div className="reserva-tabla-contenedor">
                <table>
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Nutricionista</th>
                      <th>Fecha y hora</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibles.map((cita) => (
                      <tr key={cita.id}>
                        <td>
                          {cita.paciente}
                          <small>{cita.correo}</small>
                        </td>
                        <td>{cita.nutricionista}</td>
                        <td>{cita.fecha} · {cita.hora}</td>
                        <td><span className="reserva-estado">{cita.estado}</span></td>
                        <td>
                          <div className="reserva-acciones">
                            <button type="button" onClick={() => editar(cita)}>
                              Editar
                            </button>
                            <button
                              type="button"
                              className="cancelar"
                              onClick={() => cancelar(cita.id)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}