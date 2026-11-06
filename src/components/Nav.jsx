import { BRAND } from "../config.js";
import { useNavVisibility } from "./useScrollEffects.js";

const LINKS = [
  ["#inicio", "Inicio"],
  ["#galeria", "Galería"],
  ["#servicios", "Servicios"],
  ["#contacto", "Contacto"],
];

export default function Nav() {
  const { hidden, scrolled } = useNavVisibility();
  const cls = `nav${hidden ? " nav--hidden" : ""}${scrolled ? " nav--scrolled" : ""}`;
  return (
    <header className={cls}>
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
