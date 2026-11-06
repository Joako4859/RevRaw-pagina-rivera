const WORDS = ["FOTO", "VIDEO", "AUTOS", "MOTOS", "EVENTOS"];

function Group({ hidden }) {
  // Dos vueltas por grupo para cubrir pantallas anchas sin hueco.
  const items = [...WORDS, ...WORDS];
  return (
    <div className="marquee__group" aria-hidden={hidden ? "true" : undefined}>
      {items.map((w, i) => (
        <span className="marquee__item" key={`${w}-${i}`}>
          <span className="marquee__word">{w}</span>
          <span className="marquee__dot" aria-hidden="true">·</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" role="group" aria-label="Foto, video, autos, motos y eventos">
      <div className="marquee__track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
