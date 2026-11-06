import { useRef } from "react";
import { useTilt } from "./usePointerEffects.js";

export default function TiltCard({ index, children }) {
  const ref = useRef(null);
  useTilt(ref, 6);
  return (
    <li className="card" ref={ref} style={{ "--i": index }}>
      {children}
    </li>
  );
}
