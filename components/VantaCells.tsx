"use client";

import React, { useEffect, useRef, useState } from "react";

// Extend Window interface for TypeScript
declare global {
  interface Window {
    THREE?: any;
    VANTA?: {
      CELLS: (options: Record<string, any>) => { destroy: () => void };
    };
  }
}

export interface VantaCellsProps {
  color1?: number | string;
  color2?: number | string;
  backgroundColor?: number | string;
  amplitudeFactor?: number;
  ringFactor?: number;
  rotationFactor?: number;
  speed?: number;
  size?: number;
  scale?: number;
  scaleMobile?: number;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  className?: string;
}

export default function VantaCells({
  color1 = 35980, // 0x008c8c
  color2 = 15918901, // 0xf2e735
  backgroundColor = 14155663, // 0xd7ff8f
  amplitudeFactor = 1.0,
  ringFactor = 1.0,
  rotationFactor = 1.0,
  speed = 0.6,
  size = 1.0,
  scale = 1.0,
  scaleMobile = 3.0,
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200.0,
  minWidth = 200.0,
  className = "",
}: VantaCellsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vantaEffectRef = useRef<{ destroy: () => void } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // If already in DOM and executed
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // 1. Load Three.js r121
        if (!window.THREE) {
          await loadScript("/scripts/three.r121.min.js").catch(() =>
            loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js")
          );
        }

        if (isCancelled) return;

        // 2. Load Vanta Cells
        if (!window.VANTA?.CELLS) {
          await loadScript("/scripts/vanta.cells.min.js").catch(() =>
            loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js")
          );
        }

        if (isCancelled || !containerRef.current || !window.VANTA?.CELLS) return;

        // 3. Destroy any previous instance
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
        }

        // 4. Initialize Vanta Cells with exact parameters
        vantaEffectRef.current = window.VANTA.CELLS({
          el: containerRef.current,
          mouseControls,
          touchControls,
          gyroControls,
          minHeight,
          minWidth,
          scale,
          scaleMobile,
          size,
          speed,
          color1,
          color2,
          backgroundColor,
          amplitudeFactor,
          ringFactor,
          rotationFactor,
        });

        setIsLoaded(true);
      } catch (err) {
        console.error("Error initializing Vanta Cells:", err);
      }
    };

    initVanta();

    return () => {
      isCancelled = true;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [
    color1,
    color2,
    backgroundColor,
    amplitudeFactor,
    ringFactor,
    rotationFactor,
    speed,
    size,
    scale,
    scaleMobile,
    mouseControls,
    touchControls,
    gyroControls,
    minHeight,
    minWidth,
  ]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ overflow: "hidden" }}
    />
  );
}
