import Nav from "./components/Nav.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Gallery from "./components/Gallery.jsx";
import Services from "./components/Services.jsx";
import ContactForm from "./components/ContactForm.jsx";
import Footer from "./components/Footer.jsx";
import { works } from "./data/works.js";
import "./styles.css";

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero image={works[0]?.src} />
        <Marquee />
        <Gallery works={works} />
        <Services />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
