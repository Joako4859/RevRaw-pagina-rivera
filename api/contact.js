import pg from "pg";
import { validateContact } from "../src/lib/validateContact.js";

const SAVE_ERROR = "No pudimos guardar tu pedido, probá de nuevo.";

let pool = null;

function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!pool) {
    const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(url);
    pool = new pg.Pool({
      connectionString: url,
      ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
    });
  }
  return pool;
}

function parseBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body ?? null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader?.("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método no permitido." });
  }

  const result = validateContact(parseBody(req.body));
  if (!result.ok) {
    return res.status(400).json({ ok: false, errors: result.errors });
  }

  try {
    const db = getPool();
    if (!db) throw new Error("DATABASE_URL is not set");
    const { name, email, service, message } = result.value;
    await db.query(
      "INSERT INTO quote_requests (name, email, service, message) VALUES ($1, $2, $3, $4)",
      [name, email, service, message]
    );
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("POST /api/contact failed:", err);
    return res.status(500).json({ ok: false, error: SAVE_ERROR });
  }
}
