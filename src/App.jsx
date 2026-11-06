import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Gallery from "./components/Gallery.jsx";
import Services from "./components/Services.jsx";
import ContactForm from "./components/ContactForm.jsx";
import Footer from "./components/Footer.jsx";
import { works } from "./data/works.js";
import "./styles.css";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero image={works[0]?.src} />
        <Gallery works={works} />
        <Services />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
