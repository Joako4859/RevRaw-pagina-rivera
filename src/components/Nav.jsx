import { BRAND } from "../config.js";

const LINKS = [
  ["#inicio", "Inicio"],
  ["#galeria", "Galería"],
  ["#servicios", "Servicios"],
  ["#contacto", "Contacto"],
];

export default function Nav() {
  return (
    <header className="nav">
      <nav className="nav__inner" aria-label="Principal">
        <a className="nav__brand" href="#inicio">{BRAND}</a>
        <ul className="nav__links">
          {LINKS.map(([href, label]) => (
            <li key={href} className={href === "#inicio" ? "nav__home" : undefined}><a href={href}>{label}</a></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
