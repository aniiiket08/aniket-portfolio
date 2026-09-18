"use client";

import { useEffect, useState } from "react";
import Ferrofluid from "./Ferrofluid";

export default function BackgroundCanvas() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const updatePauseState = () => {
      // Pause background WebGL when scrolled past the hero or on mobile to eliminate GPU load
      const isMobile = window.innerWidth < 768;
      const isScrolledPastHero = window.scrollY > 850;
      setPaused(isMobile || isScrolledPastHero);
    };

    updatePauseState();
    window.addEventListener("scroll", updatePauseState, { passive: true });
    window.addEventListener("resize", updatePauseState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePauseState);
      window.removeEventListener("resize", updatePauseState);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen min-h-screen -z-10 pointer-events-none overflow-hidden bg-[#080808]"
    >
      {/* 1. Very Dark, Atmospheric Ferrofluid WebGL Background */}
      <Ferrofluid
        color="#1a1a1a"
        background="#080808"
        accentColor="#292929"
        speed={0.16}
        scale={0.72}
        turbulence={0.62}
        fluidity={0.52}
        rimWidth={0.85}
        sharpness={0.95}
        shimmer={0.15}
        glow={0.22}
        opacity={0.72}
        mouseInteraction={false}
        mouseStrength={0}
        mouseRadius={0}
        paused={paused}
      />

      {/* 2. Atmospheric Darkening Layer - ensures ~90% near-black, 10% subtle movement */}
      <div className="absolute inset-0 bg-[#080808]/45 pointer-events-none" />

      {/* 3. Deep Vignette to keep text and foreground content primary */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_transparent_40%,_rgba(8,8,8,0.85)_100%)] pointer-events-none" />
    </div>
  );
}
