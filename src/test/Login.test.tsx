import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "../paginas/Login";
import { guardarUsuarios, obtenerSesion } from "../datos/auth";

function mostrarLogin() {
  guardarUsuarios([{
    nombre: "Paciente de prueba", correo: "paciente@gmail.com",
    clave: "Prueba123", rol: "Paciente", activo: true,
  }]);
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<h1>Mi perfil</h1>} />
        <Route path="/admin" element={<h1>Administración</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

function ingresar(correo: string, clave: string) {
  fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: correo } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: clave } });
  fireEvent.click(screen.getByRole("button", { name: "Ingresar a mi cuenta" }));
}

test("04 - las credenciales correctas llevan al paciente a su perfil y al administrador a su panel", () => {
  const paciente = mostrarLogin();
  ingresar("paciente@gmail.com", "Prueba123");

  expect(obtenerSesion()).toEqual({ correo: "paciente@gmail.com" });
  expect(screen.getByRole("heading", { name: "Mi perfil" }).textContent).toBe("Mi perfil");
  paciente.unmount();
  sessionStorage.clear();

  mostrarLogin();
  ingresar("admin@nutrivida.cl", "NutriVida1");

  expect(obtenerSesion()).toEqual({ correo: "admin@nutrivida.cl" });
  expect(screen.getByRole("heading", { name: "Administración" }).textContent).toBe("Administración");
});

test("05 - una contraseña incorrecta muestra un error y no inicia sesión", () => {
  mostrarLogin();
  ingresar("paciente@gmail.com", "Mala123");

  expect(screen.getByRole("alert").textContent).toContain("Correo o contraseña incorrectos.");
  expect(obtenerSesion()).toBeNull();
  expect(screen.queryByRole("heading", { name: "Mi perfil" })).toBeNull();
});

