import { useEffect, useRef, useState } from "react";
import { motionOK, scrollProgress, navState, parallaxOffset, frameThrottle } from "../lib/motion.js";

// Barra de progreso: escribe scaleX directo en el nodo (sin re-render).
export function useScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    if (!motionOK() || !ref.current) return undefined;
    const el = ref.current;
    const update = frameThrottle(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${scrollProgress(window.scrollY, max)})`;
    });
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      update.cancel();
    };
  }, []);
  return ref;
}

// Nav: oculto al bajar, visible al subir.
export function useNavVisibility() {
  const [state, setState] = useState({ hidden: false, scrolled: false });
  useEffect(() => {
    if (!motionOK()) return undefined;
    let lastY = window.scrollY;
    const update = frameThrottle(() => {
      const y = window.scrollY;
      const prevY = lastY;
      lastY = y;
      setState((s) => {
        const next = navState({ hidden: s.hidden, y, lastY: prevY });
        return next.hidden === s.hidden && next.scrolled === s.scrolled ? s : next;
      });
    });
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      update.cancel();
    };
  }, []);
  return state;
}

// Parallax: mueve `mediaRef` mas lento que el scroll; se detiene fuera de pantalla.
export function useParallax(sectionRef, mediaRef, factor = 0.25) {
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!motionOK() || !section || !media) return undefined;
    let visible = true;
    const update = frameThrottle(() => {
      if (visible) media.style.transform = `translate3d(0, ${parallaxOffset(window.scrollY, factor).toFixed(1)}px, 0)`;
    });
    let io;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) update();
      });
      io.observe(section);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
      update.cancel();
    };
  }, [sectionRef, mediaRef, factor]);
}
