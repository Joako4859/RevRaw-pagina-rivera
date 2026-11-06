import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import Lightbox from "./Lightbox.jsx";
import { works } from "../data/works.js";

afterEach(cleanup);

function setup() {
  const h = { onClose: vi.fn(), onPrev: vi.fn(), onNext: vi.fn() };
  render(<Lightbox work={works[0]} {...h} />);
  return h;
}

describe("Lightbox", () => {
  it("cierra con Esc", () => {
    const h = setup();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(h.onClose).toHaveBeenCalled();
  });

  it("enfoca cerrar, cicla el foco con Tab y bloquea el scroll", () => {
    setup();
    const pick = (n) => screen.getAllByRole("button", { name: n }).find((b) => b.tabIndex !== -1);
    const close = pick("Cerrar");
    const next = pick("Siguiente");
    expect(document.activeElement).toBe(close);
    expect(document.body.style.overflow).toBe("hidden");
    next.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(next);
  });

  it("restaura el scroll al desmontar", () => {
    setup();
    cleanup();
    expect(document.body.style.overflow).toBe("");
  });
});
