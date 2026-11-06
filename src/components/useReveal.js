import { useEffect, useRef, useState } from "react";

// Marca el bloque como visible la primera vez que entra en pantalla.
// Sin IntersectionObserver (jsdom, navegadores viejos) queda visible.
export default function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (visible || !ref.current || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [visible]);

  return [ref, visible];
}
