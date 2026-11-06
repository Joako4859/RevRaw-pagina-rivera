import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import Gallery from "./Gallery.jsx";
import { works } from "../data/works.js";

afterEach(cleanup);

describe("Gallery", () => {
  it("filtra al clickear KTM", () => {
    render(<Gallery works={works} />);
    expect(screen.getAllByRole("img").length).toBe(works.length);
    fireEvent.click(screen.getByRole("tab", { name: "KTM" }));
    const ktm = works.filter((w) => w.category === "KTM");
    expect(screen.getAllByRole("img").length).toBe(ktm.length);
    expect(screen.queryByAltText(works[0].alt)).toBeNull();
    expect(screen.getByAltText(ktm[0].alt)).toBeTruthy();
  });

  it('muestra "Todavía no hay fotos en esta categoría" cuando está vacía', () => {
    const onlyAutos = works.filter((w) => w.category === "Autos");
    render(<Gallery works={onlyAutos} />);
    fireEvent.click(screen.getByRole("tab", { name: "Eventos" }));
    expect(screen.getByText("Todavía no hay fotos en esta categoría")).toBeTruthy();
  });
});
