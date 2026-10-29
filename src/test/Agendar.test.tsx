import { beforeEach, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Agendar from "../paginas/Agendar";
import Confirmacion from "../paginas/Confirmacion";
import { guardarServicios } from "../datos/catalogo";
import { listarCitasLegadas } from "../datos/citasLegadas";

beforeEach(() => {
  // Fijamos solo Date para que las pruebas no dependan del día en que se ejecuten.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2030, 0, 15, 12));
  guardarServicios([{
    codigo: "PRUEBA-1", tipo: "Consulta", nombre: "Consulta inicial",
    descripcion: "Servicio de prueba", precio: 35000, duracion: "50 min",
    modalidad: "Presencial", profesional: "Nutricionista",
  }]);
});

function mostrarAgendamiento() {
  render(
    <MemoryRouter initialEntries={["/agendar"]}>
      <Routes>
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
      </Routes>
    </MemoryRouter>
  );
}

function completarSolicitud(rut = "123456785", fecha = "2030-01-20") {
  fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Paciente de prueba" } });
  fireEvent.change(screen.getByLabelText("RUT"), { target: { value: rut } });
  fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "paciente@gmail.com" } });
  fireEvent.change(screen.getByLabelText("Celular"), { target: { value: "912345678" } });
  fireEvent.change(screen.getByLabelText("Servicio que necesitas"), { target: { value: "Consulta inicial" } });
  fireEvent.change(screen.getByLabelText("Fecha tentativa"), { target: { value: fecha } });
}

test("08 - una reserva válida se guarda y aparece en la confirmación", () => {
  mostrarAgendamiento();
  completarSolicitud();

  fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

  expect(listarCitasLegadas()).toHaveLength(1);
  expect(listarCitasLegadas()[0]).toMatchObject({
    nombre: "Paciente de prueba", rut: "123456785", correo: "paciente@gmail.com",
    telefono: "+56 912345678", servicio: "Consulta inicial", fecha: "2030-01-20",
  });
  expect(JSON.parse(sessionStorage.getItem("reservaNutriVida") || "null")).toEqual(listarCitasLegadas()[0]);
  expect(screen.getByRole("heading", { name: "Resumen de la solicitud" }).textContent).toBe("Resumen de la solicitud");
  expect(screen.getByText("Consulta inicial").textContent).toBe("Consulta inicial");
  expect(screen.getByText("2030-01-20").textContent).toBe("2030-01-20");
});

test("09 - RUT y celular se limitan a nueve caracteres y conservan su formato permitido", () => {
  mostrarAgendamiento();
  const rut = screen.getByLabelText("RUT") as HTMLInputElement;
  const celular = screen.getByLabelText("Celular") as HTMLInputElement;

  fireEvent.change(rut, { target: { value: "12345678599" } });
  expect(rut.value).toBe("123456785");
  expect(rut.maxLength).toBe(9);

  fireEvent.change(rut, { target: { value: "12.345.678-k" } });
  expect(rut.value).toBe("12345678K");

  fireEvent.change(celular, { target: { value: "9a12345678999" } });
  expect(celular.value).toBe("912345678");
  expect(celular.maxLength).toBe(9);
});

test("10 - un RUT inválido o una fecha pasada impiden guardar la reserva", () => {
  mostrarAgendamiento();
  completarSolicitud("123456789");
  fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

  expect(screen.getByRole("alert").textContent).toContain("Ingresa un RUT chileno válido");
  expect(listarCitasLegadas()).toHaveLength(0);
  expect(sessionStorage.getItem("reservaNutriVida")).toBeNull();

  // Corregimos el RUT y comprobamos por separado el rechazo de la fecha pasada.
  completarSolicitud("123456785", "2030-01-14");
  fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

  expect(screen.getByRole("alert").textContent).toBe("Selecciona una fecha de hoy o posterior.");
  expect(listarCitasLegadas()).toHaveLength(0);
  expect(sessionStorage.getItem("reservaNutriVida")).toBeNull();
});
