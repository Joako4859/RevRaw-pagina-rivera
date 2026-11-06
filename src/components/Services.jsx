import { SERVICES } from "../config.js";
import useReveal from "./useReveal.js";

export default function Services() {
  const [ref, visible] = useReveal();
  return (
    <section id="servicios" className={`section reveal${visible ? " is-visible" : ""}`} ref={ref} aria-labelledby="servicios-title">
      <div className="container">
        <p className="eyebrow">Qué hacemos</p>
        <h2 id="servicios-title">Servicios</h2>
        <ul className="cards">
          {SERVICES.map((s, i) => (
            <li className="card" key={s.title}>
              <span className="card__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
