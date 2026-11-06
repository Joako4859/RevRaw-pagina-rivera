import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import Gallery from "./Gallery.jsx";
import { works } from "../data/works.js";

afterEach(cleanup);

const fixture = [
  { id: "a1", src: "/photos/a1.jpg", title: "Auto 1", category: "Autos", alt: "Auto uno" },
  { id: "k1", src: "/photos/k1.jpg", title: "KTM 1", category: "KTM", alt: "KTM uno" },
  { id: "a2", src: "/photos/a2.jpg", title: "Auto 2", category: "Autos", alt: "Auto dos" },
];

describe("Gallery", () => {
  it("filtra al clickear KTM", () => {
    render(<Gallery works={fixture} />);
    expect(screen.getAllByRole("img").length).toBe(fixture.length);
    fireEvent.click(screen.getByRole("tab", { name: "KTM" }));
    const ktm = fixture.filter((w) => w.category === "KTM");
    expect(screen.getAllByRole("img").length).toBe(ktm.length);
    expect(screen.queryByAltText(fixture[0].alt)).toBeNull();
    expect(screen.getByAltText(ktm[0].alt)).toBeTruthy();
  });

  it("no muestra pestañas de categorías sin fotos", () => {
    render(<Gallery works={works} />);
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Todos", "Autos"]);
    expect(screen.queryByRole("tab", { name: "KTM" })).toBeNull();
    expect(screen.queryByRole("tab", { name: "Eventos" })).toBeNull();
  });

  it('muestra "Todavía no hay fotos en esta categoría" cuando no hay fotos', () => {
    render(<Gallery works={[]} />);
    expect(screen.getByText("Todavía no hay fotos en esta categoría")).toBeTruthy();
  });
});

describe("Gallery placeholder", () => {
  it("muestra Foto próximamente cuando la imagen falla", () => {
    render(<Gallery works={works} />);
    expect(screen.queryByText("Foto próximamente")).toBeNull();
    fireEvent.error(screen.getByAltText(works[0].alt));
    expect(screen.getAllByText("Foto próximamente").length).toBe(1);
    expect(screen.getByText(works[0].title)).toBeTruthy();
  });
});
