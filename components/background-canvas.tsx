"use client";

import { useEffect, useRef } from "react";
import Ferrofluid from "./Ferrofluid";

export default function BackgroundCanvas() {
  // Use a ref so scroll/resize events never trigger a React re-render or
  // Ferrofluid prop change — the RAF loop reads this ref directly.
  const pausedRef = useRef(false);

  useEffect(() => {
    const updatePauseState = () => {
      const isMobile = window.innerWidth < 768;
      const isScrolledPastHero = window.scrollY > 850;
      pausedRef.current = isMobile || isScrolledPastHero;
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
      {/* Ferrofluid receives a stable pausedRef — no re-renders on scroll */}
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
        pausedRef={pausedRef}
      />

      {/* Atmospheric darkening layer */}
      <div className="absolute inset-0 bg-[#080808]/45 pointer-events-none" />

      {/* Deep vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_transparent_40%,_rgba(8,8,8,0.85)_100%)] pointer-events-none" />
    </div>
  );
}
