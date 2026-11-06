import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const query = vi.fn();
vi.mock("pg", () => {
  class Pool {
    constructor() {
      this.query = query;
    }
  }
  return { default: { Pool }, Pool };
});

import handler from "../api/contact.js";
import { SERVICES } from "../src/config.js";

const makeRes = () => {
  const res = { statusCode: null, body: null, headers: {} };
  res.status = vi.fn((n) => {
    res.statusCode = n;
    return res;
  });
  res.json = vi.fn((b) => {
    res.body = b;
    return res;
  });
  res.setHeader = vi.fn((k, v) => {
    res.headers[k] = v;
  });
  return res;
};

const valid = {
  name: "Juan Pérez",
  email: "juan@example.com",
  service: SERVICES[0].title,
  message: "Quiero cotizar una sesión de mi auto.",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    query.mockReset();
    query.mockResolvedValue({ rows: [] });
    process.env.DATABASE_URL = "postgres://u:p@localhost:5432/db";
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("201 con datos válidos y hace INSERT parametrizado", async () => {
    const res = makeRes();
    await handler({ method: "POST", body: valid }, res);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ ok: true });
    expect(query).toHaveBeenCalledTimes(1);
    const [sql, params] = query.mock.calls[0];
    expect(sql).toMatch(/INSERT INTO quote_requests/i);
    expect(sql).toContain("$1");
    expect(sql).toContain("$4");
    expect(sql).not.toContain(valid.email);
    expect(params).toEqual([valid.name, valid.email, valid.service, valid.message]);
  });

  it("acepta body como string JSON", async () => {
    const res = makeRes();
    await handler({ method: "POST", body: JSON.stringify(valid) }, res);
    expect(res.statusCode).toBe(201);
  });

  it("400 con email inválido y no toca la DB", async () => {
    const res = makeRes();
    await handler({ method: "POST", body: { ...valid, email: "nope" } }, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.errors.email).toBeTruthy();
    expect(query).not.toHaveBeenCalled();
  });

  it("400 con body ausente o JSON roto", async () => {
    const r1 = makeRes();
    await handler({ method: "POST" }, r1);
    expect(r1.statusCode).toBe(400);
    const r2 = makeRes();
    await handler({ method: "POST", body: "{broken" }, r2);
    expect(r2.statusCode).toBe(400);
    expect(query).not.toHaveBeenCalled();
  });

  it("405 en GET", async () => {
    const res = makeRes();
    await handler({ method: "GET" }, res);
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe("POST");
    expect(query).not.toHaveBeenCalled();
  });

  it("500 si la query lanza, sin filtrar detalles", async () => {
    query.mockRejectedValue(new Error("secret db detail"));
    const res = makeRes();
    await handler({ method: "POST", body: valid }, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      ok: false,
      error: "No pudimos guardar tu pedido, probá de nuevo.",
    });
    expect(JSON.stringify(res.body)).not.toContain("secret");
  });

  it("500 si falta DATABASE_URL", async () => {
    delete process.env.DATABASE_URL;
    const res = makeRes();
    await handler({ method: "POST", body: valid }, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("No pudimos guardar tu pedido, probá de nuevo.");
    expect(query).not.toHaveBeenCalled();
  });
});
