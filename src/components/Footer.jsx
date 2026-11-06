import { BRAND, CONTACT_EMAIL, WHATSAPP } from "../config.js";

export default function Footer() {
  const wa = WHATSAPP.replace(/\D/g, "");
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">{BRAND}</p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p>
          <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </p>
      </div>
    </footer>
  );
}
