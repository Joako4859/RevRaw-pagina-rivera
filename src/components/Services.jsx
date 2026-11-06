import { SERVICES } from "../config.js";
import useReveal from "./useReveal.js";
import TiltCard from "./TiltCard.jsx";

export default function Services() {
  const [ref, visible] = useReveal();
  return (
    <section id="servicios" className={`section reveal${visible ? " is-visible" : ""}`} ref={ref} aria-labelledby="servicios-title">
      <div className="container">
        <p className="eyebrow">Qué hacemos</p>
        <h2 id="servicios-title">Servicios</h2>
        <ul className="cards">
          {SERVICES.map((s, i) => (
            <TiltCard key={s.title} index={i}>
              <span className="card__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </TiltCard>
          ))}
        </ul>
      </div>
    </section>
  );
}
