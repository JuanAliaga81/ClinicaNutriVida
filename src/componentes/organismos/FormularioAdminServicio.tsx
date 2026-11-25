import AreaTexto from "../atomos/AreaTexto";
import Selector from "../atomos/Selector";
import Input from "../atomos/Input";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import type { Servicio } from "../../datos/catalogo";

export type FormularioServicio = Omit<Servicio, "codigo">;

type Props = {
  servicioForm: FormularioServicio;
  setServicioForm: Dispatch<SetStateAction<FormularioServicio>>;
  servicioEditando: string | null;
  guardarServicio: (evento: FormEvent) => void;
  error: string;
  alCancelar: () => void;
};

const tiposServicio = [
  "Consulta",
  "Plan especializado",
  "Evaluación",
  "Taller grupal",
  "Taller",
];

export default function FormularioAdminServicio({
  servicioForm,
  setServicioForm,
  servicioEditando,
  guardarServicio,
  error,
  alCancelar,
}: Props) {
  return (
    <form onSubmit={guardarServicio} noValidate>
      <fieldset className="row g-3">
        <CampoFormulario
          className="col-12 col-md-6"
          id="servicio-nombre"
          etiqueta="Nombre del servicio"
        >
          <Input
            id="servicio-nombre"
            maxLength={100}
            value={servicioForm.nombre}
            onChange={(e) =>
              setServicioForm({ ...servicioForm, nombre: e.target.value })
            }
          />
        </CampoFormulario>

        <CampoFormulario
          className="col-12 col-md-6"
          id="servicio-tipo"
          etiqueta="Categoría"
        >
          <Selector
            id="servicio-tipo"
            value={servicioForm.tipo}
            onChange={(e) =>
              setServicioForm({ ...servicioForm, tipo: e.target.value })
            }
          >
            {tiposServicio.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </Selector>
        </CampoFormulario>

        <CampoFormulario
          className="col-12 col-md-4"
          id="servicio-precio"
          etiqueta="Precio (CLP)"
        >
          <Input
            id="servicio-precio"
            type="number"
            min={1}
            step={1000}
            value={servicioForm.precio || ""}
            onChange={(e) =>
              setServicioForm({
                ...servicioForm,
                precio: Number(e.target.value),
              })
            }
          />
        </CampoFormulario>

        <CampoFormulario
          className="col-12 col-md-4"
          id="servicio-duracion"
          etiqueta="Duración"
        >
          <Input
            id="servicio-duracion"
            placeholder="Ej. 45 min"
            value={servicioForm.duracion}
            onChange={(e) =>
              setServicioForm({ ...servicioForm, duracion: e.target.value })
            }
          />
        </CampoFormulario>

        <CampoFormulario
          className="col-12 col-md-4"
          id="servicio-modalidad"
          etiqueta="Modalidad"
        >
          <Selector
            id="servicio-modalidad"
            value={servicioForm.modalidad}
            onChange={(e) =>
              setServicioForm({ ...servicioForm, modalidad: e.target.value })
            }
          >
            <option>Presencial</option>
            <option>Online (video)</option>
            <option>Presencial u online</option>
            <option>Presencial (grupo)</option>
          </Selector>
        </CampoFormulario>

        <CampoFormulario
          className="col-12 col-md-6"
          id="servicio-profesional"
          etiqueta="Profesional"
        >
          <Input
            id="servicio-profesional"
            value={servicioForm.profesional}
            onChange={(e) =>
              setServicioForm({
                ...servicioForm,
                profesional: e.target.value,
              })
            }
          />
        </CampoFormulario>

        <CampoFormulario
          className="col-12"
          id="servicio-descripcion"
          etiqueta="Descripción"
        >
          <AreaTexto
            id="servicio-descripcion"
            rows={3}
            maxLength={500}
            value={servicioForm.descripcion}
            onChange={(e) =>
              setServicioForm({
                ...servicioForm,
                descripcion: e.target.value,
              })
            }
          />
        </CampoFormulario>
      </fieldset>

      {error && (
        <p className="alert alert-danger mt-3 mb-0" role="alert">
          {error}
        </p>
      )}

      <div className="admin-form-acciones">
        <button type="submit" className="admin-crear">
          {servicioEditando ? "Guardar cambios" : "Añadir servicio"}
        </button>
        <button type="button" className="admin-cancelar" onClick={alCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
