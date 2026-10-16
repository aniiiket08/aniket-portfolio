"use client";

import React, { useId } from "react";

export interface BackgroundGridProps {
  className?: string;
  stripeWidth?: number;
  noiseOpacity?: number;
  ambientGlow?: boolean;
  vignette?: boolean;
}

export interface BackgroundNoiseGridProps extends BackgroundGridProps {
  children?: React.ReactNode;
}

/**
 * High-Performance Architectural Columns & Tactile Noise Background.
 *
 * Refined, ultra-premium obsidian aesthetic:
 * - Pure Math & Native CSS: 4-stop micro-bevel cylindrical fluting with subtle obsidian-to-charcoal
 *   shading (#020203 to #0e0e12) and 1px architectural hairlines.
 * - Hardware Accelerated: `pointer-events-none`, `select-none`, `transform-gpu`, and `will-change-transform`.
 * - Tactile Film Grain: Seamless fine-pitch grain at calibrated opacity for zero visual fatigue.
 */
export function BackgroundGrid({
  className = "",
  stripeWidth = 72,
  noiseOpacity = 0.055,
  ambientGlow = true,
  vignette = true,
}: BackgroundGridProps) {
  const filterId = useId();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 z-0 overflow-hidden transform-gpu will-change-transform bg-[#040406] ${className}`}
      style={
        {
          "--stripe-w": `${stripeWidth}px`,
        } as React.CSSProperties
      }
    >
      {/* =========================================================================
          LAYER 1: Subtle Obsidian Architectural Columns
          Deep, nuanced cylindrical fluting (#020203 to #0e0e12) with 1px hairlines.
         ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full transform-gpu will-change-transform"
        style={{
          backgroundImage: `repeating-linear-gradient(
            to right,
            rgba(255, 255, 255, 0.035) 0px,
            rgba(255, 255, 255, 0.035) 1px,
            #0d0d12 1px,
            #0a0a0e calc(var(--stripe-w) * 0.45),
            #060608 calc(var(--stripe-w) - 2px),
            #010102 calc(var(--stripe-w) - 2px),
            #010102 var(--stripe-w)
          )`,
          backgroundSize: "var(--stripe-w) 100%",
        }}
      />

      {/* =========================================================================
          LAYER 2: Sophisticated Ambient Depth & Lighting
          Understated top radiance and gentle foreground framing.
         ========================================================================= */}
      {ambientGlow && (
        <>
          {/* Subtle top-center atmospheric glow */}
          <div
            className="absolute inset-0 pointer-events-none transform-gpu will-change-transform"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(55, 68, 92, 0.12) 0%, rgba(20, 24, 34, 0.05) 50%, transparent 80%)",
            }}
          />

          {/* Understated core card-framing luminescence */}
          <div
            className="absolute inset-0 pointer-events-none transform-gpu will-change-transform"
            style={{
              background:
                "radial-gradient(ellipse 60% 45% at 50% 45%, rgba(255, 255, 255, 0.018) 0%, transparent 65%)",
            }}
          />
        </>
      )}

      {/* =========================================================================
          LAYER 3: Integral Vignette Falloff
         ========================================================================= */}
      {vignette && (
        <div
          className="absolute inset-0 pointer-events-none transform-gpu will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(2, 2, 4, 0.4) 75%, rgba(0, 0, 1, 0.8) 100%)",
          }}
        />
      )}

      {/* =========================================================================
          LAYER 4: Tactile Matte Film Grain
         ========================================================================= */}
      <div
        className="absolute inset-0 h-full w-full pointer-events-none select-none transform-gpu will-change-transform"
        style={{
          backgroundImage: "url(/noise.webp)",
          backgroundSize: "160px 160px",
          backgroundRepeat: "repeat",
          opacity: noiseOpacity,
        }}
      />

      {/* Inline SVG filter fallback */}
      <svg className="hidden" aria-hidden="true">
        <filter id={`tactile-noise-${filterId}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
    </div>
  );
}

/**
 * Section or page wrapper for Noise Grid.
 */
export function BackgroundNoiseGrid({
  children,
  className = "",
  stripeWidth = 72,
  noiseOpacity = 0.055,
  ambientGlow = true,
  vignette = true,
}: BackgroundNoiseGridProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#040406] ${className}`}
    >
      <BackgroundGrid
        stripeWidth={stripeWidth}
        noiseOpacity={noiseOpacity}
        ambientGlow={ambientGlow}
        vignette={vignette}
      />
      {children && <div className="relative z-10 w-full">{children}</div>}
    </div>
  );
}

export default BackgroundNoiseGrid;
