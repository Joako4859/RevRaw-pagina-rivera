import { useEffect, useRef, useState } from "react";

export default function Lightbox({ work, onClose, onPrev, onNext }) {
  const [failed, setFailed] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    setFailed(false);
  }, [work.id]);

  useEffect(() => {
    const prevFocus = document.activeElement;
    closeRef.current?.focus();
    return () => prevFocus?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={work.title}>
      <button className="lightbox__backdrop" onClick={onClose} aria-label="Cerrar" tabIndex={-1} />
      <figure className="lightbox__figure">
        {failed ? (
          <div className="lightbox__missing">Imagen no disponible</div>
        ) : (
          <img src={work.src} alt={work.alt} onError={() => setFailed(true)} />
        )}
        <figcaption>{work.title}</figcaption>
      </figure>
      <button ref={closeRef} className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Cerrar">×</button>
      <button className="lightbox__btn lightbox__prev" onClick={onPrev} aria-label="Anterior">‹</button>
      <button className="lightbox__btn lightbox__next" onClick={onNext} aria-label="Siguiente">›</button>
    </div>
  );
}
