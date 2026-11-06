import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import ContactForm from "./ContactForm.jsx";
import { SERVICES } from "../config.js";

function fill() {
  fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana Pérez" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ana@correo.com" } });
  fireEvent.change(screen.getByLabelText("Servicio"), { target: { value: SERVICES[0].title } });
  fireEvent.change(screen.getByLabelText("Mensaje"), {
    target: { value: "Quiero una sesión para mi auto." },
  });
}
const submit = () => fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

beforeEach(() => {
  global.fetch = vi.fn();
});
afterEach(cleanup);

describe("ContactForm", () => {
  it("muestra errores por campo y no llama fetch si es inválido", () => {
    render(<ContactForm />);
    submit();
    expect(screen.getByText("El nombre debe tener entre 2 y 80 caracteres.")).toBeTruthy();
    expect(screen.getByText("Ingresá un email válido.")).toBeTruthy();
    expect(screen.getByText("Elegí un servicio de la lista.")).toBeTruthy();
    expect(screen.getByText("El mensaje debe tener entre 10 y 2000 caracteres.")).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("muestra éxito en 201", async () => {
    fetch.mockResolvedValue({ ok: true, status: 201, json: async () => ({ ok: true }) });
    render(<ContactForm />);
    fill();
    submit();
    await waitFor(() => expect(screen.getByText(/mensaje fue enviado/i)).toBeTruthy());
    expect(fetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
  });

  it("muestra error en 500 y re-habilita el botón", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ ok: false, error: "No pudimos guardar tu mensaje." }),
    });
    render(<ContactForm />);
    fill();
    submit();
    await waitFor(() => expect(screen.getByText("No pudimos guardar tu mensaje.")).toBeTruthy());
    expect(screen.getByRole("button", { name: /enviar/i }).disabled).toBe(false);
  });

  it("deshabilita el botón mientras envía", async () => {
    let resolve;
    fetch.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<ContactForm />);
    fill();
    submit();
    await waitFor(() => expect(screen.getByRole("button", { name: /enviando/i }).disabled).toBe(true));
    resolve({ ok: true, status: 201, json: async () => ({ ok: true }) });
    await waitFor(() => expect(screen.getByText(/mensaje fue enviado/i)).toBeTruthy());
  });
});
