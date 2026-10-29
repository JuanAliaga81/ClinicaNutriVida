import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CatalogoServicios from "../componentes/organismos/CatalogoServicios";
import CardCatalogoServicio from "../componentes/moleculas/CardCatalogoServicio";
import DetalleServicio from "../paginas/DetalleServicio";
import Agendar from "../paginas/Agendar";
import { guardarServicios, type Servicio } from "../datos/catalogo";

const servicio: Servicio = {
  codigo: "PRUEBA-1",
  tipo: "Consulta",
  nombre: "Consulta inicial",
  descripcion: "Evaluación de hábitos",
  precio: 35000,
  duracion: "50 min",
  modalidad: "Presencial",
  profesional: "Nutricionista",
  imagen: "/img/Doctor.jpg",
};

test("06 - el catálogo muestra todos los servicios y permite filtrarlos", () => {
  guardarServicios([
    servicio,
    {
      ...servicio,
      codigo: "PRUEBA-2",
      tipo: "Taller grupal",
      nombre: "Taller de hábitos",
    },
    {
      ...servicio,
      codigo: "PRUEBA-3",
      nombre: "Control mensual",
      descripcion: "Seguimiento",
    },
  ]);

  render(
    <MemoryRouter>
      <CatalogoServicios />
    </MemoryRouter>,
  );

  // Primero deben aparecer todos los servicios guardados.
  expect(screen.getByRole("status").textContent).toBe(
    "3 servicios encontrados",
  );

  expect(
    screen
      .getAllByRole("heading", { level: 2 })
      .map((elemento) => elemento.textContent),
  ).toEqual(["Consulta inicial", "Taller de hábitos", "Control mensual"]);

  expect(screen.getAllByRole("link", { name: "Ver detalle" })).toHaveLength(3);

  // La búsqueda coincide con dos servicios.
  fireEvent.change(screen.getByLabelText("Buscar servicio"), {
    target: { value: "hábitos" },
  });

  expect(screen.getByRole("status").textContent).toBe(
    "2 servicios encontrados",
  );

  expect(
    screen
      .getAllByRole("heading", { level: 2 })
      .map((elemento) => elemento.textContent),
  ).toEqual(["Consulta inicial", "Taller de hábitos"]);

  // Al combinar búsqueda y categoría solo debe quedar uno.
  fireEvent.change(screen.getByLabelText("Tipo de servicio"), {
    target: { value: "Consulta" },
  });

  expect(screen.getByRole("status").textContent).toBe("1 servicio encontrado");

  expect(
    screen.getByRole("heading", { name: "Consulta inicial" }).textContent,
  ).toBe("Consulta inicial");

  expect(
    screen.queryByRole("heading", { name: "Taller de hábitos" }),
  ).toBeNull();

  expect(screen.queryByRole("heading", { name: "Control mensual" })).toBeNull();

  // Una búsqueda sin coincidencias muestra el mensaje correspondiente.
  fireEvent.change(screen.getByLabelText("Buscar servicio"), {
    target: { value: "inexistente" },
  });

  expect(screen.getByRole("status").textContent).toBe(
    "0 servicios encontrados",
  );

  expect(
    screen.getByText("No hay servicios que coincidan con tu búsqueda.")
      .textContent,
  ).toBe("No hay servicios que coincidan con tu búsqueda.");

  expect(screen.queryAllByRole("heading", { level: 2 })).toHaveLength(0);

  // Al quitar los filtros se recupera la lista completa.
  fireEvent.change(screen.getByLabelText("Buscar servicio"), {
    target: { value: "" },
  });

  fireEvent.change(screen.getByLabelText("Tipo de servicio"), {
    target: { value: "Todos" },
  });

  expect(
    screen
      .getAllByRole("heading", { level: 2 })
      .map((elemento) => elemento.textContent),
  ).toEqual(["Consulta inicial", "Taller de hábitos", "Control mensual"]);

  expect(
    screen.queryByText("No hay servicios que coincidan con tu búsqueda."),
  ).toBeNull();
});

test("07 - la tarjeta muestra sus propiedades y permite reservar el servicio elegido", () => {
  guardarServicios([servicio]);

  render(
    <MemoryRouter initialEntries={["/servicios"]}>
      <Routes>
        <Route
          path="/servicios"
          element={<CardCatalogoServicio servicio={servicio} />}
        />
        <Route path="/servicios/:codigo" element={<DetalleServicio />} />
        <Route path="/agendar" element={<Agendar />} />
      </Routes>
    </MemoryRouter>,
  );

  // La tarjeta debe representar los datos recibidos mediante props.
  expect(
    screen.getByRole("heading", { name: "Consulta inicial" }).textContent,
  ).toBe("Consulta inicial");

  expect(screen.getByText("Evaluación de hábitos").textContent).toBe(
    "Evaluación de hábitos",
  );

  expect(screen.getByText("Consulta", { exact: true }).textContent).toBe(
    "Consulta",
  );

  // Leemos el párrafo completo: contiene la etiqueta y su valor.
  expect(screen.getByText(/Duración:/).closest("p")?.textContent).toContain(
    "50 min",
  );

  expect(screen.getByText(/Modalidad:/).closest("p")?.textContent).toContain(
    "Presencial",
  );

  // Quitamos posibles espacios del formato monetario.
  expect(screen.getByText(/\$\s*35\.000/).textContent?.replace(/\s/g, "")).toBe(
    "$35.000",
  );

  expect(
    screen.getByAltText("Imagen de Consulta inicial").getAttribute("src"),
  ).toBe("/img/Doctor.jpg");

  expect(
    screen.getByRole("link", { name: "Ver detalle" }).getAttribute("href"),
  ).toBe("/servicios/PRUEBA-1");

  // Seguimos el recorrido tarjeta → detalle → reserva.
  fireEvent.click(screen.getByRole("link", { name: "Ver detalle" }));

  expect(
    screen.getByRole("heading", {
      name: "Consulta inicial",
      level: 1,
    }).textContent,
  ).toBe("Consulta inicial");

  fireEvent.click(screen.getByRole("link", { name: "Reserva tu hora" }));

  const selector = screen.getByLabelText(
    "Servicio que necesitas",
  ) as HTMLSelectElement;

  expect(selector.value).toBe("Consulta inicial");

  expect(screen.getByLabelText("RUT").getAttribute("maxlength")).toBe("9");
});
