"use client";

import React, { useRef } from "react";
import VantaCells from "./VantaCells";
import { BackgroundGrid } from "./background-noise-grid";
import Ferrofluid from "./Ferrofluid";

/* =========================================================================
 * 🎨 BACKGROUND SWITCHER:
 * Change this string anytime right here to switch backgrounds:
 *
 *   "vanta-cells" -> Interactive Vanta Cells from vantajs.com
 *   "noise-grid"  -> Aceternity 3D fluted columns with noise texture
 *   "ferrofluid"  -> WebGL fluid simulation
 * ========================================================================= */
export const ACTIVE_BACKGROUND: "vanta-cells" | "noise-grid" | "ferrofluid" = "noise-grid";

export default function BackgroundCanvas() {
  const pausedRef = useRef(false);

  React.useEffect(() => {
    if (ACTIVE_BACKGROUND !== "ferrofluid") return;

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
      className="fixed inset-0 w-screen h-screen min-h-screen -z-10 pointer-events-none select-none overflow-hidden bg-black"
    >
      {/* 1. VANTA CELLS (Active) */}
      {ACTIVE_BACKGROUND === "vanta-cells" && (
        <>
          <VantaCells
            color1={35980} // 0x008c8c
            color2={15918901} // 0xf2e735
            backgroundColor={14155663} // 0xd7ff8f
            amplitudeFactor={1.0}
            ringFactor={1.0}
            rotationFactor={1.0}
            speed={0.6}
            size={1.0}
            scale={1.0}
            scaleMobile={3.0}
            mouseControls={true}
            touchControls={true}
            gyroControls={false}
          />

          {/* Dedicated semi-transparent black tint layer placed directly on top of the background */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* Soft vertical black gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 pointer-events-none" />
        </>
      )}

      {/* 2. NOISE GRID (Architectural Columns + Tactile Noise) */}
      {ACTIVE_BACKGROUND === "noise-grid" && (
        <>
          <BackgroundGrid stripeWidth={72} noiseOpacity={0.055} />

          {/* Dedicated semi-transparent black tint layer (reduced by 9%) */}
          <div className="absolute inset-0 bg-black/16 pointer-events-none" />

          {/* Soft vertical black gradient (reduced by 10%) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55 pointer-events-none" />

          {/* Subtle radial vignette layer (reduced by 9%) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_40%,rgba(0,0,0,0.36)_80%,rgba(0,0,0,0.76)_100%)] pointer-events-none" />
        </>
      )}



      {/* 3. FERROFLUID (WebGL Simulation) */}
      {ACTIVE_BACKGROUND === "ferrofluid" && (
        <>
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
          <div className="absolute inset-0 bg-[#080808]/45 pointer-events-none" />
        </>
      )}
    </div>
  );
}
