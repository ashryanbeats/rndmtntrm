import React, { useEffect, useRef } from "react";
import { animate } from "animejs";

const AnimationDemo: React.FC = () => {
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationRef.current) {
      animate(".anime-box", {
        translateX: 250,
        rotate: "1turn",
        backgroundColor: "#FFC107",
        borderRadius: ["0%", "50%"],
        easing: "easeInOutQuad",
        duration: 2000,
        loop: true,
        direction: "alternate",
      });
    }
  }, []);

  return (
    <div className="animation-container">
      <h3>Anime.js Demo</h3>
      <div ref={animationRef} className="anime-box"></div>
      <style>{`
        .animation-container {
          padding: 2rem;
          text-align: center;
        }
        .anime-box {
          width: 50px;
          height: 50px;
          background-color: #3F51B5;
          margin: 1rem auto;
        }
      `}</style>
    </div>
  );
};

export default AnimationDemo;
