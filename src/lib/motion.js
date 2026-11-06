// Utilidades de movimiento: logica pura + chequeos de entorno (seguros en jsdom).

export function motionOK() {
  try {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function finePointer() {
  try {
    return motionOK() && window.matchMedia("(pointer: fine)").matches;
  } catch {
    return false;
  }
}

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Progreso de scroll 0..1.
export function scrollProgress(y, max) {
  if (!(max > 0)) return 0;
  return clamp(y / max, 0, 1);
}

// Desplazamiento del parallax del hero (la imagen va mas lenta que el scroll).
export function parallaxOffset(y, factor = 0.25) {
  return Math.max(0, y) * factor;
}

// Estado del nav: se oculta al bajar, vuelve al subir, y se "vela" tras scrollear.
export function navState({ hidden, y, lastY, delta = 6, topOffset = 80, blurAfter = 16 }) {
  let nextHidden = hidden;
  if (y <= topOffset) nextHidden = false;
  else if (y - lastY > delta) nextHidden = true;
  else if (lastY - y > delta) nextHidden = false;
  return { hidden: nextHidden, scrolled: y > blurAfter };
}

// Atraccion magnetica hacia el puntero: maximo `max` px, solo dentro de `radius`.
export function magneticOffset(dx, dy, max = 8, radius = 120) {
  const dist = Math.hypot(dx, dy);
  if (dist === 0 || dist > radius) return { x: 0, y: 0 };
  const pull = Math.min(max, dist * 0.2);
  return { x: (dx / dist) * pull, y: (dy / dist) * pull };
}

// Inclinacion 3D segun la posicion del puntero (px, py en 0..1 dentro de la tarjeta).
export function tiltAngles(px, py, max = 6) {
  const cx = clamp(px, 0, 1) - 0.5;
  const cy = clamp(py, 0, 1) - 0.5;
  return { rx: -cy * 2 * max, ry: cx * 2 * max };
}

// Ejecuta `fn` como mucho una vez por frame.
export function frameThrottle(fn) {
  let id = 0;
  const run = (...args) => {
    if (id) return;
    id = requestAnimationFrame(() => {
      id = 0;
      fn(...args);
    });
  };
  run.cancel = () => {
    if (id) cancelAnimationFrame(id);
    id = 0;
  };
  return run;
}
