import { useScrollProgress } from "./useScrollEffects.js";

export default function ScrollProgress() {
  const ref = useScrollProgress();
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
