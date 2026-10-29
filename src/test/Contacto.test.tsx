import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contacto from "../paginas/Contacto";
import Administracion from "../paginas/Administracion";
import Perfil from "../paginas/Perfil";
import { guardarUsuarios, listarUsuarios, inicializarAdminDemo, iniciarSesion } from "../datos/auth";
import { listarMensajesContacto } from "../datos/mensajesContacto";

test("15 - contacto, administrador y paciente comparten la conversación y sus respuestas", () => {
  const contacto = render(<MemoryRouter><Contacto /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Paciente de prueba" } });
  fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "paciente@gmail.com" } });
  fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: "¿Cómo puedo coordinar mi consulta?" } });

  fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

  expect(screen.getByRole("status").textContent).toContain("Tu mensaje quedó registrado.");
  expect(listarMensajesContacto()).toHaveLength(1);
  expect(listarMensajesContacto()[0].conversacion).toHaveLength(1);
  contacto.unmount();

  inicializarAdminDemo();
  iniciarSesion("admin@nutrivida.cl");
  const admin = render(<MemoryRouter><Administracion /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: /^Mensajes/ }));
  expect(screen.getByText("¿Cómo puedo coordinar mi consulta?").textContent).toBe("¿Cómo puedo coordinar mi consulta?");
  fireEvent.change(screen.getByLabelText("Responder en esta conversación"), { target: { value: "Puedes solicitar una hora desde Reservas." } });

  fireEvent.click(screen.getByRole("button", { name: "Enviar respuesta" }));

  expect(listarMensajesContacto()[0].conversacion).toHaveLength(2);
  expect(listarMensajesContacto()[0].conversacion[1]).toMatchObject({
    autor: "admin", texto: "Puedes solicitar una hora desde Reservas.",
  });
  admin.unmount();

  guardarUsuarios([...listarUsuarios(), {
    nombre: "Paciente de prueba", correo: "paciente@gmail.com",
    clave: "Prueba123", rol: "Paciente", activo: true,
  }]);
  iniciarSesion("paciente@gmail.com");
  render(<MemoryRouter><Perfil /></MemoryRouter>);

  expect(screen.getByText("Respuesta recibida").textContent).toBe("Respuesta recibida");
  expect(screen.getByText("Puedes solicitar una hora desde Reservas.").textContent).toBe("Puedes solicitar una hora desde Reservas.");
  fireEvent.change(screen.getByLabelText("Responder en esta conversación"), { target: { value: "Gracias, solicitaré mi hora." } });
  fireEvent.click(screen.getByRole("button", { name: "Enviar", exact: true }));

  expect(listarMensajesContacto()[0].conversacion).toHaveLength(3);
  expect(listarMensajesContacto()[0].conversacion[2]).toMatchObject({
    autor: "usuario", texto: "Gracias, solicitaré mi hora.",
  });
  expect(listarMensajesContacto()[0].leido).toBe(false);
});

