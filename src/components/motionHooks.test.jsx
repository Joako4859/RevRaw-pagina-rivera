import { render, cleanup, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import ScrollProgress from "./ScrollProgress.jsx";
import Nav from "./Nav.jsx";

function mockMedia(reduce) {
  window.matchMedia = vi.fn((q) => ({
    matches: q.includes("reduce") ? reduce : false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
  }));
}

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb) => setTimeout(() => cb(0), 0));
  vi.stubGlobal("cancelAnimationFrame", (id) => clearTimeout(id));
});
afterEach(() => {
  cleanup();
  delete window.matchMedia;
  vi.unstubAllGlobals();
});

async function scrollTo(y, doc = 3000) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", { value: doc, configurable: true });
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((r) => setTimeout(r, 5));
  });
}

describe("ScrollProgress", () => {
  it("escribe scaleX acotado entre 0 y 1", async () => {
    mockMedia(false);
    const { container } = render(<ScrollProgress />);
    const bar = container.querySelector(".scroll-progress");
    await scrollTo(1000);
    expect(bar.style.transform).toBe("scaleX(0.5)");
    await scrollTo(99999);
    expect(bar.style.transform).toBe("scaleX(1)");
    await scrollTo(-20);
    expect(bar.style.transform).toBe("scaleX(0)");
  });

  it("no hace nada con reduced-motion", async () => {
    mockMedia(true);
    const { container } = render(<ScrollProgress />);
    await scrollTo(1000);
    expect(container.querySelector(".scroll-progress").style.transform).toBe("");
  });

  it("limpia el listener al desmontar", async () => {
    mockMedia(false);
    const spy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ScrollProgress />);
    unmount();
    expect(spy.mock.calls.some(([t]) => t === "scroll")).toBe(true);
  });
});

describe("Nav", () => {
  it("se oculta al bajar, vuelve al subir y se vela", async () => {
    mockMedia(false);
    await scrollTo(0);
    const { container } = render(<Nav />);
    const nav = container.querySelector("header");
    expect(nav.className).toBe("nav");
    await scrollTo(400);
    expect(nav.className).toContain("nav--hidden");
    expect(nav.className).toContain("nav--scrolled");
    await scrollTo(300);
    expect(nav.className).not.toContain("nav--hidden");
    expect(nav.className).toContain("nav--scrolled");
  });

  it("no cambia con reduced-motion", async () => {
    mockMedia(true);
    await scrollTo(0);
    const { container } = render(<Nav />);
    await scrollTo(500);
    expect(container.querySelector("header").className).toBe("nav");
  });
});
