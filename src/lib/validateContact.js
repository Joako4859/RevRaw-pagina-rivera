import { SERVICES } from "../config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ["name", "email", "service", "message"];

const MSG = {
  invalid: "Datos de contacto inválidos.",
  name: "El nombre debe tener entre 2 y 80 caracteres.",
  email: "Ingresá un email válido.",
  service: "Elegí un servicio de la lista.",
  message: "El mensaje debe tener entre 10 y 2000 caracteres.",
};

const trimString = (v) => (typeof v === "string" ? v.trim() : "");

export function validateContact(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return {
      ok: false,
      errors: Object.fromEntries(FIELDS.map((f) => [f, MSG.invalid])),
    };
  }

  const value = {
    name: trimString(input.name),
    email: trimString(input.email),
    service: trimString(input.service),
    message: trimString(input.message),
  };

  const errors = {};
  if (value.name.length < 2 || value.name.length > 80) {
    errors.name = MSG.name;
  }
  if (!EMAIL_RE.test(value.email)) {
    errors.email = MSG.email;
  }
  if (!SERVICES.some((s) => s.title === value.service)) {
    errors.service = MSG.service;
  }
  if (value.message.length < 10 || value.message.length > 2000) {
    errors.message = MSG.message;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, value };
}
