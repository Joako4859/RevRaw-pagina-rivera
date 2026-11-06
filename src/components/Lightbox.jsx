import { useEffect, useRef, useState } from "react";

function LightboxImage({ work }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="lightbox__missing">Foto próximamente</div>
  ) : (
    <img src={work.src} alt={work.alt} onError={() => setFailed(true)} />
  );
}

export default function Lightbox({ work, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const prevFocus = document.activeElement;
    closeRef.current?.focus();
    return () => prevFocus?.focus?.();
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Tab") {
        const nodes = rootRef.current?.querySelectorAll("button:not([tabindex='-1'])");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        const outside = !rootRef.current.contains(active);
        if (e.shiftKey && (active === first || outside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || outside)) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div ref={rootRef} className="lightbox" role="dialog" aria-modal="true" aria-label={work.title}>
      <button className="lightbox__backdrop" onClick={onClose} aria-label="Cerrar" tabIndex={-1} />
      <figure className="lightbox__figure" key={work.id}>
        <LightboxImage work={work} />
        <figcaption>{work.title}</figcaption>
      </figure>
      <button ref={closeRef} className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Cerrar">×</button>
      <button className="lightbox__btn lightbox__prev" onClick={onPrev} aria-label="Anterior">‹</button>
      <button className="lightbox__btn lightbox__next" onClick={onNext} aria-label="Siguiente">›</button>
    </div>
  );
}
