// Base interface for all glitch effects
interface GlitchEffect {
  enabled: boolean;
  probability: number; // 0-1 chance of triggering
}

// Define each effect configuration
interface FlickerEffect extends GlitchEffect {
  intensity: number; // 0-1 scale for opacity change
}

interface MovementEffect extends GlitchEffect {
  amount: number; // pixels to move
}

interface SkewEffect extends GlitchEffect {
  amount: number; // degrees to skew
}

interface VowelRemovalEffect extends GlitchEffect {
  duration: number; // milliseconds
}

interface ColorFlashEffect extends GlitchEffect {
  colors: string[];
}

interface ClusteringEffect extends GlitchEffect {
  count: number; // number of glitches in a cluster
  spacing: number; // milliseconds between cluster glitches
}

// Complete glitch configuration
export interface GlitchConfig {
  flicker: FlickerEffect;
  horizontalMovement: MovementEffect;
  horizontalSkew: SkewEffect;
  verticalSkew: SkewEffect;
  vowelRemoval: VowelRemovalEffect;
  colorFlash: ColorFlashEffect;
  clustering: ClusteringEffect;
  duration: number; // base duration for animations
}

export interface GlitchTextProps {
  text: string;
  delay?: number;
  config?: Partial<GlitchConfig>; // Configuration overrides
}

// Type for the global event system
export type GlitchEvent = {
  type: "hideVowels" | "showVowels";
};
