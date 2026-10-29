import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Registro from "../paginas/Registro";
import { guardarUsuarios, listarUsuarios } from "../datos/auth";

function mostrarRegistro() {
  render(
    <MemoryRouter initialEntries={["/registro"]}>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<h1>Iniciar sesión</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

function completarRegistro(confirmacion = "Prueba123") {
  fireEvent.change(screen.getByLabelText("Nombre completo"), {
    target: { value: "Paciente de prueba" },
  });

  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: "paciente@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Contraseña (4 a 10 caracteres)"), {
    target: { value: "Prueba123" },
  });

  fireEvent.change(screen.getByLabelText("Confirmar contraseña"), {
    target: { value: confirmacion },
  });
}

test("01 - crear una cuenta válida guarda un paciente y muestra el inicio de sesión", () => {
  mostrarRegistro();

  expect(screen.queryByRole("alert")).toBeNull();

  completarRegistro();

  fireEvent.click(screen.getByRole("button", { name: "Crear mi cuenta" }));

  expect(listarUsuarios()).toEqual([
    {
      nombre: "Paciente de prueba",
      correo: "paciente@gmail.com",
      clave: "Prueba123",
      rol: "Paciente",
      activo: true,
    },
  ]);

  expect(
    screen.getByRole("heading", { name: "Iniciar sesión" }).textContent,
  ).toBe("Iniciar sesión");

  expect(screen.queryByRole("alert")).toBeNull();
});

test("02 - un correo repetido muestra un error y no crea otra cuenta", () => {
  guardarUsuarios([
    {
      nombre: "Cuenta existente",
      correo: "PACIENTE@gmail.com",
      clave: "Otra123",
      rol: "Paciente",
      activo: true,
    },
  ]);

  mostrarRegistro();
  completarRegistro();

  expect(screen.queryByRole("alert")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Crear mi cuenta" }));

  expect(screen.getByRole("alert").textContent).toBe(
    "Este correo ya está registrado.",
  );

  expect(listarUsuarios()).toHaveLength(1);
  expect(listarUsuarios()[0].nombre).toBe("Cuenta existente");

  expect(screen.queryByRole("heading", { name: "Iniciar sesión" })).toBeNull();
});

test("03 - el error de contraseñas desaparece al corregirlas y permite crear la cuenta", () => {
  mostrarRegistro();
  completarRegistro("Distinta1");

  // Antes de enviar no debe aparecer el mensaje de validación.
  expect(screen.queryByRole("alert")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Crear mi cuenta" }));

  expect(screen.getByRole("alert").textContent).toBe(
    "Las contraseñas no coinciden.",
  );

  expect(listarUsuarios()).toHaveLength(0);

  // Corregimos la confirmación.
  fireEvent.change(screen.getByLabelText("Confirmar contraseña"), {
    target: { value: "Prueba123" },
  });

  expect(screen.queryByRole("alert")).toBeNull();

  // Corregir el campo no debe crear la cuenta automáticamente.
  expect(listarUsuarios()).toHaveLength(0);

  fireEvent.click(screen.getByRole("button", { name: "Crear mi cuenta" }));

  expect(listarUsuarios()).toHaveLength(1);
  expect(listarUsuarios()[0]).toMatchObject({
    correo: "paciente@gmail.com",
    rol: "Paciente",
    activo: true,
  });

  expect(
    screen.getByRole("heading", { name: "Iniciar sesión" }).textContent,
  ).toBe("Iniciar sesión");

  expect(screen.queryByRole("alert")).toBeNull();
});
