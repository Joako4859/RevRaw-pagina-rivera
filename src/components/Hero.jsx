import { useRef, useState } from "react";
import { BRAND } from "../config.js";
import { useParallax } from "./useScrollEffects.js";
import { useMagnetic, useCursorGlow } from "./usePointerEffects.js";

const LINES = ["Fotografía", "y video", "de autos"];

export default function Hero({ image }) {
  const [failed, setFailed] = useState(false);
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const glowRef = useRef(null);
  const ctaRef = useRef(null);
  useParallax(sectionRef, mediaRef);
  useCursorGlow(sectionRef, glowRef);
  useMagnetic(ctaRef, 8);

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title" ref={sectionRef}>
      {image && !failed && (
        <div className="hero__media" ref={mediaRef} aria-hidden="true">
          <img className="hero__bg" src={image} alt="" onError={() => setFailed(true)} />
        </div>
      )}
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__glow" ref={glowRef} aria-hidden="true" />
      <div className="hero__content">
        <p className="eyebrow hero__fade hero__fade--1">{BRAND}</p>
        <h1 id="hero-title">
          {LINES.map((line, i) => (
            <span key={line}>
              <span className="hero__line">
                <span className="hero__line-inner" style={{ "--l": i }}>{line}</span>
              </span>
              {i < LINES.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className="hero__lead hero__fade hero__fade--3">
          Autos, motos y eventos contados con una imagen cuidada.
        </p>
        <a className="btn hero__fade hero__fade--4" href="#contacto" ref={ctaRef}>Pedí tu sesión</a>
      </div>
    </section>
  );
}
