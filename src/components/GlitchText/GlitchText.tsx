import { useEffect, useState } from "react";
import "./GlitchText.css";

interface GlitchTextProps {
  text: string;
  delay?: number;
  intensity?: "low" | "medium" | "high";
}

export default function GlitchText({
  text,
  delay = 4000,
  intensity = "medium",
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);

      setTimeout(() => {
        setIsGlitching(false);
      }, 200);
    }, delay);

    return () => clearInterval(glitchInterval);
  }, [delay]);

  const glitchClass = isGlitching ? `glitch-${intensity}` : "";

  return <span className={`glitch-text ${glitchClass}`}>{text}</span>;
}
