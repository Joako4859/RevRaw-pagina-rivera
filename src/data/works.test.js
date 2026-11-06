import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { works } from "./works.js";
import { CATEGORIES } from "../config.js";

// Vitest corre desde la raíz del proyecto (import.meta.url no es file:// en jsdom).
const publicDir = join(process.cwd(), "public");

describe("works", () => {
  it("cada categoría pertenece a CATEGORIES", () => {
    for (const w of works) {
      expect(CATEGORIES, `categoría de ${w.id}`).toContain(w.category);
    }
  });

  it("los ids son únicos", () => {
    const ids = works.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada src existe en public/", () => {
    for (const w of works) {
      expect(existsSync(join(publicDir, w.src)), w.src).toBe(true);
    }
  });
});
