"use client";

import React, { useEffect, useState } from "react";

interface Bubble {
  id: number;
  size: number;
  left: number;
  delay:number;
  duration: number;
  opacity: number;
}

const BubblesBackground: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = Array.from({ length: 33 }, (_, i) => ({
        id: i,
        size: Math.random() * 40 + 20, 
        left: Math.random() * 100,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4, 
        opacity: Math.random() * 0.4 + 0.3,
      }));
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className="absolute h-[100vh] w-[100vw]   z-[2] inset-0 overflow-hidden ">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-cyan-400/20 blur-2xl animate-bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            top: "100%", // start from middle
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            opacity: bubble.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default BubblesBackground;
