import { useState } from "react";
import { SERVICES } from "../config.js";
import { validateContact } from "../lib/validateContact.js";
import useReveal from "./useReveal.js";

const EMPTY = { name: "", email: "", service: "", message: "" };
const GENERIC_ERROR = "No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.";

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [serverError, setServerError] = useState("");
  const [ref, visible] = useReveal();

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    const result = validateContact(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setServerError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.value),
      });
      if (res.status === 201) {
        setValues(EMPTY);
        setStatus("sent");
        return;
      }
      let body = {};
      try {
        body = await res.json();
      } catch {
        /* respuesta sin JSON */
      }
      if (body && body.errors) setErrors(body.errors);
      setServerError((body && body.error) || GENERIC_ERROR);
      setStatus("error");
    } catch {
      setServerError(GENERIC_ERROR);
      setStatus("error");
    }
  }

  const sending = status === "sending";
  const field = (name) => ({
    id: `contact-${name}`,
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    value: values[name],
    onChange: set(name),
  });
  const err = (name) =>
    errors[name] ? (
      <p className="field__error" id={`contact-${name}-error`}>{errors[name]}</p>
    ) : null;

  return (
    <section id="contacto" className={`section reveal${visible ? " is-visible" : ""}`} ref={ref} aria-labelledby="contacto-title">
      <div className="container container--narrow">
        <p className="eyebrow">Hablemos</p>
        <h2 id="contacto-title">Contacto</h2>
        {status === "sent" ? (
          <p className="notice" role="status">
            ¡Gracias! Tu mensaje fue enviado. Te respondemos a la brevedad.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="contact-name">Nombre</label>
              <input type="text" maxLength={80} autoComplete="name" {...field("name")} />
              {err("name")}
            </div>
            <div className="field">
              <label htmlFor="contact-email">Email</label>
              <input type="email" autoComplete="email" {...field("email")} />
              {err("email")}
            </div>
            <div className="field">
              <label htmlFor="contact-service">Servicio</label>
              <select {...field("service")}>
                <option value="">Elegí un servicio</option>
                {SERVICES.map((s) => (
                  <option key={s.title} value={s.title}>{s.title}</option>
                ))}
              </select>
              {err("service")}
            </div>
            <div className="field">
              <label htmlFor="contact-message">Mensaje</label>
              <textarea rows="5" maxLength={2000} {...field("message")} />
              {err("message")}
            </div>
            {status === "error" && (
              <p className="notice notice--error" role="alert">{serverError}</p>
            )}
            <button className="btn" type="submit" disabled={sending}>
              {sending ? "Enviando…" : "Enviar mensaje"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
