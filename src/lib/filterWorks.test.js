import { describe, it, expect } from "vitest";
import { filterWorks } from "./filterWorks.js";

const works = [
  { id: "a1", src: "/photos/a1.jpg", title: "A1", category: "Autos", alt: "A1" },
  { id: "a2", src: "/photos/a2.jpg", title: "A2", category: "Autos", alt: "A2" },
  { id: "k1", src: "/photos/k1.jpg", title: "K1", category: "KTM", alt: "K1" },
];

describe("filterWorks", () => {
  it("Todos devuelve todas", () => {
    expect(filterWorks(works, "Todos")).toEqual(works);
  });

  it("filtra por categoría", () => {
    expect(filterWorks(works, "Autos").map((w) => w.id)).toEqual(["a1", "a2"]);
    expect(filterWorks(works, "KTM").map((w) => w.id)).toEqual(["k1"]);
  });

  it("categoría sin fotos devuelve []", () => {
    expect(filterWorks(works, "Eventos")).toEqual([]);
  });

  it("no muta el arreglo original", () => {
    const copy = works.slice();
    const result = filterWorks(works, "Todos");
    filterWorks(works, "Autos");
    expect(works).toEqual(copy);
    expect(result).not.toBe(works);
  });
});
