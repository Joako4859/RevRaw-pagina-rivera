import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { CATEGORIES } from "../config.js";
import { ALL_CATEGORY, filterWorks } from "../lib/filterWorks.js";
import Lightbox from "./Lightbox.jsx";
import useReveal from "./useReveal.js";
import { motionOK } from "../lib/motion.js";

function Thumb({ work, index, onOpen }) {
  const [state, setState] = useState("loading"); // loading | loaded | failed
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setState("loaded");
  }, []);

  return (
    <li className="gallery__item" style={{ "--i": Math.min(index, 10) }}>
      <button className="gallery__open" onClick={onOpen} aria-label={`Ver ${work.title}`}>
        <img
          ref={imgRef}
          src={work.src}
          alt={work.alt}
          loading="lazy"
          className={state === "loaded" ? "is-loaded" : "is-pending"}
          onLoad={() => setState("loaded")}
          onError={() => setState("failed")}
        />
        {state !== "loaded" && (
          <span className="gallery__placeholder" aria-hidden="true">
            {state === "failed" ? "Foto próximamente" : ""}
          </span>
        )}
        <span className="gallery__caption">
          <span>{work.title}</span>
          <small>{work.category}</small>
        </span>
      </button>
    </li>
  );
}

export default function Gallery({ works }) {
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [openIndex, setOpenIndex] = useState(null);
  const [direction, setDirection] = useState(0);
  const [pill, setPill] = useState(null);
  const tabsRef = useRef(null);
  const [ref, visible] = useReveal();
  const items = filterWorks(works, category);
  const tabs = [ALL_CATEGORY, ...CATEGORIES.filter((c) => works.some((w) => w.category === c))];

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => {
      setDirection(-1);
      setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    },
    [items.length]
  );
  const next = useCallback(
    () => {
      setDirection(1);
      setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
    },
    [items.length]
  );

  // Indicador deslizante de la pestana activa (solo con movimiento permitido).
  useLayoutEffect(() => {
    const root = tabsRef.current;
    if (!motionOK() || !root) return undefined;
    const measure = () => {
      const el = root.querySelector('[aria-selected="true"]');
      if (!el || !el.offsetWidth) return setPill(null);
      setPill({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [category, tabs.length]);

  const select = (c) => {
    setCategory(c);
    setOpenIndex(null);
  };

  return (
    <section id="galeria" className={`section reveal${visible ? " is-visible" : ""}`} ref={ref} aria-labelledby="galeria-title">
      <div className="container">
        <p className="eyebrow">Portfolio</p>
        <h2 id="galeria-title">Galería</h2>
        <div className={`tabs${pill ? " tabs--pill" : ""}`} role="tablist" aria-label="Categorías" ref={tabsRef}>
          {pill && (
            <span
              className="tabs__pill"
              aria-hidden="true"
              style={{ height: pill.h, transform: `translate(${pill.x}px, ${pill.y}px) scaleX(${pill.w / 100})` }}
            />
          )}
          {tabs.map((c) => (
            <button
              key={c}
              role="tab"
              id={`tab-${c}`}
              aria-selected={category === c}
              aria-controls="gallery-panel"
              className="tabs__tab"
              onClick={() => select(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div id="gallery-panel" role="tabpanel" aria-labelledby={`tab-${category}`}>
          {items.length === 0 ? (
            <p className="gallery__empty">Todavía no hay fotos en esta categoría</p>
          ) : (
            <ul className="gallery" key={category}>
              {items.map((w, i) => (
                <Thumb key={w.id} work={w} index={i} onOpen={() => { setDirection(0); setOpenIndex(i); }} />
              ))}
            </ul>
          )}
        </div>
      </div>
      {openIndex !== null && items[openIndex] && (
        <Lightbox work={items[openIndex]} onClose={close} onPrev={prev} onNext={next} direction={direction} />
      )}
    </section>
  );
}
