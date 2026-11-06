import { describe, it, expect } from "vitest";
import { validateContact } from "./validateContact.js";
import { SERVICES } from "../config.js";

const valid = {
  name: "Juan Pérez",
  email: "juan@example.com",
  service: SERVICES[0].title,
  message: "Quisiera una sesión de fotos para mi auto.",
};

describe("validateContact", () => {
  it("valida entrada correcta y recorta espacios", () => {
    const result = validateContact({
      name: "  Juan Pérez  ",
      email: "  juan@example.com  ",
      service: `  ${SERVICES[0].title}  `,
      message: "   Quisiera una sesión de fotos para mi auto.   ",
    });
    expect(result).toEqual({
      ok: true,
      value: {
        name: "Juan Pérez",
        email: "juan@example.com",
        service: SERVICES[0].title,
        message: "Quisiera una sesión de fotos para mi auto.",
      },
    });
  });

  it("rechaza email inválido (errors.email)", () => {
    const result = validateContact({ ...valid, email: "no-es-un-email" });
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeTypeOf("string");
  });

  it("rechaza nombre vacío", () => {
    const result = validateContact({ ...valid, name: "   " });
    expect(result.ok).toBe(false);
    expect(result.errors.name).toBeTypeOf("string");
  });

  it("rechaza mensaje de 2001 caracteres", () => {
    const result = validateContact({ ...valid, message: "a".repeat(2001) });
    expect(result.ok).toBe(false);
    expect(result.errors.message).toBeTypeOf("string");
  });

  it("rechaza servicio fuera de la lista", () => {
    const result = validateContact({ ...valid, service: "Servicio inventado" });
    expect(result.ok).toBe(false);
    expect(result.errors.service).toBeTypeOf("string");
  });

  it("rechaza null y no-objetos sin lanzar", () => {
    expect(() => validateContact(null)).not.toThrow();
    expect(validateContact(null).ok).toBe(false);
    expect(validateContact(undefined).ok).toBe(false);
    expect(validateContact("texto").ok).toBe(false);
    expect(validateContact(42).ok).toBe(false);
    expect(validateContact([]).ok).toBe(false);
  });
});
