import { describe, it, expect, afterEach, vi } from "vitest";
import {
  scrollProgress,
  parallaxOffset,
  navState,
  magneticOffset,
  tiltAngles,
  motionOK,
  finePointer,
} from "./motion.js";

afterEach(() => {
  delete window.matchMedia;
});

describe("scrollProgress", () => {
  it("limita a 0..1", () => {
    expect(scrollProgress(-50, 1000)).toBe(0);
    expect(scrollProgress(500, 1000)).toBe(0.5);
    expect(scrollProgress(5000, 1000)).toBe(1);
  });
  it("devuelve 0 si no hay scroll posible", () => {
    expect(scrollProgress(100, 0)).toBe(0);
    expect(scrollProgress(100, -10)).toBe(0);
  });
});

describe("parallaxOffset", () => {
  it("va al 25% del scroll y nunca es negativo", () => {
    expect(parallaxOffset(400)).toBe(100);
    expect(parallaxOffset(-100)).toBe(0);
  });
});

describe("navState", () => {
  it("se oculta al bajar y vuelve al subir", () => {
    expect(navState({ hidden: false, y: 300, lastY: 200 }).hidden).toBe(true);
    expect(navState({ hidden: true, y: 250, lastY: 300 }).hidden).toBe(false);
  });
  it("ignora movimientos chicos y mantiene el estado", () => {
    expect(navState({ hidden: true, y: 302, lastY: 300 }).hidden).toBe(true);
    expect(navState({ hidden: false, y: 302, lastY: 300 }).hidden).toBe(false);
  });
  it("siempre visible cerca del tope y marca scrolled", () => {
    expect(navState({ hidden: true, y: 40, lastY: 20 })).toEqual({ hidden: false, scrolled: true });
    expect(navState({ hidden: false, y: 0, lastY: 0 }).scrolled).toBe(false);
  });
});

describe("magneticOffset", () => {
  it("nunca supera el maximo y apunta hacia el puntero", () => {
    const o = magneticOffset(100, 0, 8, 120);
    expect(o.x).toBe(8);
    expect(o.y).toBe(0);
    const d = magneticOffset(30, 40, 8, 120);
    expect(Math.hypot(d.x, d.y)).toBeLessThanOrEqual(8);
  });
  it("es cero fuera del radio", () => {
    expect(magneticOffset(500, 0)).toEqual({ x: 0, y: 0 });
  });
});

describe("tiltAngles", () => {
  it("no supera 6 grados", () => {
    const t = tiltAngles(1, 0, 6);
    expect(t.ry).toBe(6);
    expect(t.rx).toBe(6);
    expect(tiltAngles(5, -5, 6)).toEqual(tiltAngles(1, 0, 6));
  });
  it("centro = sin inclinacion", () => {
    const t = tiltAngles(0.5, 0.5);
    expect(Math.abs(t.rx)).toBe(0);
    expect(Math.abs(t.ry)).toBe(0);
  });
});

describe("motionOK / finePointer", () => {
  it("falso sin matchMedia (jsdom)", () => {
    expect(motionOK()).toBe(false);
    expect(finePointer()).toBe(false);
  });
  it("falso con prefers-reduced-motion: reduce", () => {
    window.matchMedia = vi.fn((q) => ({ matches: true, media: q }));
    expect(motionOK()).toBe(false);
    expect(finePointer()).toBe(false);
  });
  it("verdadero cuando se permite movimiento", () => {
    window.matchMedia = vi.fn((q) => ({ matches: !q.includes("reduce"), media: q }));
    expect(motionOK()).toBe(true);
    expect(finePointer()).toBe(true);
  });
});
