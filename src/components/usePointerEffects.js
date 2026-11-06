import { useEffect } from "react";
import { finePointer, magneticOffset, tiltAngles, frameThrottle } from "../lib/motion.js";

// Atraccion magnetica (solo escritorio). Escribe --mx/--my en el elemento.
export function useMagnetic(ref, max = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!finePointer() || !el) return undefined;
    let last = null;
    const move = frameThrottle(() => {
      if (!last) return;
      const r = el.getBoundingClientRect();
      const o = magneticOffset(last.x - (r.left + r.width / 2), last.y - (r.top + r.height / 2), max);
      el.style.setProperty("--mx", `${o.x.toFixed(1)}px`);
      el.style.setProperty("--my", `${o.y.toFixed(1)}px`);
    });
    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY };
      move();
    };
    const reset = () => {
      last = { x: Infinity, y: Infinity };
      move();
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      move.cancel();
    };
  }, [ref, max]);
}

// Inclinacion 3D de tarjeta (solo escritorio). Escribe --rx/--ry.
export function useTilt(ref, max = 6) {
  useEffect(() => {
    const el = ref.current;
    if (!finePointer() || !el) return undefined;
    let last = null;
    const apply = frameThrottle(() => {
      if (!last) return;
      const r = el.getBoundingClientRect();
      const t = tiltAngles((last.x - r.left) / r.width, (last.y - r.top) / r.height, max);
      el.style.setProperty("--rx", `${t.rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${t.ry.toFixed(2)}deg`);
    });
    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY };
      apply();
    };
    const onLeave = () => {
      apply.cancel();
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      apply.cancel();
    };
  }, [ref, max]);
}

// Resplandor suave que sigue al cursor dentro de `areaRef` (solo escritorio).
export function useCursorGlow(areaRef, glowRef) {
  useEffect(() => {
    const area = areaRef.current;
    const glow = glowRef.current;
    if (!finePointer() || !area || !glow) return undefined;
    let last = null;
    const apply = frameThrottle(() => {
      if (!last) return;
      glow.style.transform = `translate3d(${last.x}px, ${last.y}px, 0) translate(-50%, -50%)`;
    });
    const onMove = (e) => {
      const r = area.getBoundingClientRect();
      last = { x: e.clientX - r.left, y: e.clientY - r.top };
      glow.classList.add("is-on");
      apply();
    };
    const onLeave = () => glow.classList.remove("is-on");
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      apply.cancel();
    };
  }, [areaRef, glowRef]);
}
