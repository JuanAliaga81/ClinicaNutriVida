import { test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Administracion from "../paginas/Administracion";
import CatalogoServicios from "../componentes/organismos/CatalogoServicios";
import { guardarUsuarios, inicializarAdminDemo, iniciarSesion } from "../datos/auth";
import { guardarServicios, listarServicios, type Servicio } from "../datos/catalogo";

const servicioInicial: Servicio = {
  codigo: "PRUEBA-1", tipo: "Consulta", nombre: "Consulta de prueba",
  descripcion: "Descripción inicial", precio: 35000, duracion: "50 min",
  modalidad: "Presencial", profesional: "Nutricionista", imagen: "/img/Doctor.jpg",
};

function abrirServicios(servicios: Servicio[] = [servicioInicial]) {
  inicializarAdminDemo();
  iniciarSesion("admin@nutrivida.cl");
  guardarServicios(servicios);
  const vista = render(<MemoryRouter><Administracion /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: /^Servicios/ }));
  return vista;
}

test("11 - un paciente no puede ver el panel de administración", () => {
  guardarUsuarios([{
    nombre: "Paciente de prueba", correo: "paciente@gmail.com",
    clave: "Prueba123", rol: "Paciente", activo: true,
  }]);
  iniciarSesion("paciente@gmail.com");
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<Administracion />} />
        <Route path="/perfil" element={<h1>Mi perfil</h1>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: "Mi perfil" }).textContent).toBe("Mi perfil");
  expect(screen.queryByRole("heading", { name: "Administración" })).toBeNull();
  expect(screen.queryByRole("button", { name: "+ Crear usuario" })).toBeNull();
});

test("12 - crear un servicio con imagen lo guarda y lo muestra en el catálogo", async () => {
  // jsdom no decodifica imágenes ni dibuja canvas. Simulamos solo esas APIs
  // del navegador; el formulario, la lectura del archivo y el guardado son reales.
  const imagenOptimizada = "data:image/jpeg;base64,aW1hZ2VuLWRlLXBydWViYQ==";
  vi.spyOn(window, "Image").mockImplementation(function () {
    const imagen = document.createElement("img");
    imagen.width = 800;
    imagen.height = 600;
    Object.defineProperty(imagen, "src", {
      set() { queueMicrotask(() => imagen.dispatchEvent(new Event("load"))); },
    });
    return imagen;
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    fillStyle: "", fillRect: vi.fn(), drawImage: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(imagenOptimizada);
  const vista = abrirServicios([]);

  fireEvent.click(screen.getByRole("button", { name: "+ Añadir servicio" }));
  fireEvent.change(screen.getByLabelText("Nombre del servicio"), { target: { value: "Servicio nuevo" } });
  fireEvent.change(screen.getByLabelText("Precio (CLP)"), { target: { value: "42000" } });
  fireEvent.change(screen.getByLabelText("Duración"), { target: { value: "45 min" } });
  fireEvent.change(screen.getByLabelText("Descripción"), { target: { value: "Atención de prueba" } });
  fireEvent.change(screen.getByLabelText("Imagen del servicio"), {
    target: { files: [new File(["imagen de prueba"], "servicio.png", { type: "image/png" })] },
  });

  expect((screen.getByRole("button", { name: "Añadir servicio", exact: true }) as HTMLButtonElement).disabled).toBe(true);
  await waitFor(() => {
    expect(screen.getByAltText("Vista previa del servicio").getAttribute("src")).toBe(imagenOptimizada);
    expect((screen.getByRole("button", { name: "Añadir servicio", exact: true }) as HTMLButtonElement).disabled).toBe(false);
  });
  fireEvent.click(screen.getByRole("button", { name: "Añadir servicio", exact: true }));

  expect(listarServicios()).toHaveLength(1);
  expect(listarServicios()[0]).toMatchObject({ nombre: "Servicio nuevo", precio: 42000, imagen: imagenOptimizada });
  vista.unmount();
  render(<MemoryRouter><CatalogoServicios /></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Servicio nuevo" }).textContent).toBe("Servicio nuevo");
  expect(screen.getByAltText("Imagen de Servicio nuevo").getAttribute("src")).toBe(imagenOptimizada);
});

test("13 - editar un servicio actualiza sus datos sin duplicarlo y conserva la imagen", () => {
  const vista = abrirServicios();
  fireEvent.click(screen.getByRole("button", { name: "Editar", exact: true }));
  fireEvent.change(screen.getByLabelText("Nombre del servicio"), { target: { value: "Consulta actualizada" } });
  fireEvent.change(screen.getByLabelText("Precio (CLP)"), { target: { value: "40000" } });

  fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

  expect(listarServicios()).toHaveLength(1);
  expect(listarServicios()[0]).toMatchObject({
    codigo: "PRUEBA-1", nombre: "Consulta actualizada", precio: 40000, imagen: "/img/Doctor.jpg",
  });
  vista.unmount();
  render(<MemoryRouter><CatalogoServicios /></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Consulta actualizada" }).textContent).toBe("Consulta actualizada");
  expect(screen.queryByRole("heading", { name: "Consulta de prueba" })).toBeNull();
});

test("14 - confirmar la eliminación retira el servicio del catálogo", () => {
  const confirmar = vi.spyOn(window, "confirm").mockReturnValue(true);
  const vista = abrirServicios();

  fireEvent.click(screen.getByRole("button", { name: "Eliminar", exact: true }));

  expect(confirmar).toHaveBeenCalledTimes(1);
  expect(confirmar.mock.calls[0][0]).toContain("Consulta de prueba");
  expect(listarServicios()).toHaveLength(0);
  vista.unmount();
  render(<MemoryRouter><CatalogoServicios /></MemoryRouter>);
  expect(screen.getByRole("status").textContent).toBe("0 servicios encontrados");
  expect(screen.queryByRole("heading", { name: "Consulta de prueba" })).toBeNull();
});

