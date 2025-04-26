import { useEffect, useRef, useState, useCallback } from "react";
import { animate } from "animejs";
import type {
  GlitchConfig,
  GlitchEvent,
  GlitchTextProps,
} from "./GlitchText.types";
import "./GlitchText.css";

// Global event listeners
const listeners: Array<(event: GlitchEvent) => void> = [];

// Function to emit an event to all GlitchText components
const emitGlitchEvent = (event: GlitchEvent) => {
  listeners.forEach((listener) => listener(event));
};

// Track if vowel removal is already scheduled to prevent duplicates
let vowelRemovalScheduled = false;

// Default configuration
const defaultConfig: GlitchConfig = {
  flicker: {
    enabled: true,
    intensity: 0.7, // opacity goes to 0.7
    probability: 0.5,
  },
  horizontalMovement: {
    enabled: true,
    amount: 3,
    probability: 0.5,
  },
  horizontalSkew: {
    enabled: true,
    amount: 2,
    probability: 0.45,
  },
  verticalSkew: {
    enabled: false,
    amount: 0,
    probability: 0.4,
  },
  vowelRemoval: {
    enabled: true,
    probability: 0.4,
    duration: 300,
  },
  colorFlash: {
    enabled: true,
    colors: ["#0000FF", "#FF0000"],
    probability: 0.5,
  },
  clustering: {
    enabled: true,
    probability: 0.15,
    count: 3,
    spacing: 180,
  },
  duration: 200,
};

const removeVowels = (str: string) => {
  return str.replace(/[aeiouAEIOU]/g, "");
};

export default function GlitchText({
  text,
  delay = 4000,
  config = {},
}: GlitchTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState(text);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Merge the default config with user overrides
  const getEffectiveConfig = useCallback(() => {
    return {
      ...defaultConfig,
      ...config,
      flicker: {
        ...defaultConfig.flicker,
        ...(config.flicker || {}),
      },
      horizontalMovement: {
        ...defaultConfig.horizontalMovement,
        ...(config.horizontalMovement || {}),
      },
      horizontalSkew: {
        ...defaultConfig.horizontalSkew,
        ...(config.horizontalSkew || {}),
      },
      verticalSkew: {
        ...defaultConfig.verticalSkew,
        ...(config.verticalSkew || {}),
      },
      vowelRemoval: {
        ...defaultConfig.vowelRemoval,
        ...(config.vowelRemoval || {}),
      },
      colorFlash: {
        ...defaultConfig.colorFlash,
        ...(config.colorFlash || {}),
      },
      clustering: {
        ...defaultConfig.clustering,
        ...(config.clustering || {}),
      },
    };
  }, [config]);

  // Function to run a single glitch animation
  const triggerGlitch = useCallback(() => {
    if (!textRef.current) return;

    const effectiveConfig = getEffectiveConfig();

    // Handle clustering
    const clustering = effectiveConfig.clustering;
    const shouldCluster =
      clustering.enabled && Math.random() < clustering.probability;
    const clusterCount = shouldCluster ? clustering.count : 1;

    // Run a series of glitches for clusters
    for (let i = 0; i < clusterCount; i++) {
      setTimeout(() => {
        // Handle vowel removal
        const vowelRemoval = effectiveConfig.vowelRemoval;
        const shouldHideVowels =
          vowelRemoval.enabled &&
          Math.random() < vowelRemoval.probability &&
          !vowelRemovalScheduled;

        if (shouldHideVowels) {
          // Set flag to prevent other components from scheduling same action
          vowelRemovalScheduled = true;

          // Broadcast to all components to hide vowels
          emitGlitchEvent({ type: "hideVowels" });

          // Restore text after a short delay
          setTimeout(() => {
            emitGlitchEvent({ type: "showVowels" });
            vowelRemovalScheduled = false;
          }, vowelRemoval.duration);
        }

        // Set up the animation configuration
        let animationConfig: any = {
          duration: effectiveConfig.duration,
          easing: "steps(3)",
        };

        // Apply flicker effect
        const flicker = effectiveConfig.flicker;
        if (flicker.enabled && Math.random() < flicker.probability) {
          const opacityMin = 1 - flicker.intensity;
          animationConfig.opacity = [1, opacityMin, 1];
        }

        // Apply horizontal movement
        const horizontalMovement = effectiveConfig.horizontalMovement;
        if (
          horizontalMovement.enabled &&
          Math.random() < horizontalMovement.probability
        ) {
          const amount = horizontalMovement.amount;
          // Create more complex movement for higher amounts
          if (amount > 4) {
            animationConfig.translateX = [
              -amount,
              amount,
              -amount / 2,
              amount / 2,
              0,
            ];
          } else {
            animationConfig.translateX = [-amount, amount, 0];
          }
        }

        // Apply horizontal skew
        const horizontalSkew = effectiveConfig.horizontalSkew;
        if (
          horizontalSkew.enabled &&
          Math.random() < horizontalSkew.probability
        ) {
          const amount = horizontalSkew.amount;
          // Create more complex skew for higher amounts
          if (amount > 1.5) {
            animationConfig.skewX = [
              -amount,
              amount,
              -amount / 2,
              amount / 2,
              0,
            ];
          } else {
            animationConfig.skewX = [amount, -amount, 0];
          }
        }

        // Apply vertical skew
        const verticalSkew = effectiveConfig.verticalSkew;
        if (verticalSkew.enabled && Math.random() < verticalSkew.probability) {
          const amount = verticalSkew.amount;
          animationConfig.skewY = [-amount, amount, 0];
        }

        // Apply color flash effect
        const colorFlash = effectiveConfig.colorFlash;
        if (colorFlash.enabled && Math.random() < colorFlash.probability) {
          const colors = colorFlash.colors;
          animationConfig.color = [
            { value: "#000000" },
            ...colors.map((color) => ({ value: color, duration: 10 })),
            { value: "#000000" },
          ];
        }

        // Add slight randomness to duration
        animationConfig.duration *= 0.8 + Math.random() * 0.4;

        // Use a non-null assertion since we've already checked textRef.current exists
        animate(textRef.current!, animationConfig);
      }, i * clustering.spacing); // Spacing between cluster glitches
    }
  }, [getEffectiveConfig]);

  // Function to trigger a glitch with randomized timing
  const scheduleNextGlitch = useCallback(() => {
    // Randomize the next glitch timing (between 70%-130% of base delay)
    const randomDelay = delay * (0.7 + Math.random() * 0.6);

    timeoutRef.current = setTimeout(() => {
      triggerGlitch();
      scheduleNextGlitch(); // Schedule the next glitch
    }, randomDelay);
  }, [delay, triggerGlitch]);

  useEffect(() => {
    if (!textRef.current) return;

    // Register event listener for this component
    const handleGlitchEvent = (event: GlitchEvent) => {
      if (event.type === "hideVowels") {
        setDisplayText(removeVowels(text));
      } else if (event.type === "showVowels") {
        setDisplayText(text);
      }
    };

    listeners.push(handleGlitchEvent);

    // Start the cycle of random glitches
    scheduleNextGlitch();

    // Clean up all timeouts and event listeners on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Remove this component's listener
      const index = listeners.indexOf(handleGlitchEvent);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }, [scheduleNextGlitch, text]);

  return (
    <span ref={textRef} className="glitch-text">
      {displayText}
    </span>
  );
}
