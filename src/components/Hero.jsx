import { useState } from "react";
import { BRAND } from "../config.js";

export default function Hero({ image }) {
  const [failed, setFailed] = useState(false);
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      {image && !failed && (
        <img className="hero__bg" src={image} alt="" onError={() => setFailed(true)} />
      )}
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__content">
        <p className="eyebrow hero__fade hero__fade--1">{BRAND}</p>
        <h1 id="hero-title" className="hero__fade hero__fade--2">Fotografía y video de autos</h1>
        <p className="hero__lead hero__fade hero__fade--3">
          Autos, motos y eventos contados con imagen cuidada, desde Neuquén.
        </p>
        <a className="btn hero__fade hero__fade--4" href="#contacto">Pedí tu sesión</a>
      </div>
    </section>
  );
}
