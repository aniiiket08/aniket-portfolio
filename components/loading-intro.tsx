"use client";

import { useEffect, useRef, useState } from "react";

export default function LoadingIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Cleanly remove the static SSR overlay from DOM
    const ssrOverlay = document.getElementById("loading-intro-ssr");
    if (ssrOverlay) {
      ssrOverlay.classList.add("hide");
      ssrOverlay.remove();
    }

    // Lock page scroll during the intro animation
    document.body.style.overflow = "hidden";

    // Small initial breath before starting the reveal
    const revealTimer = setTimeout(() => {
      setIsRevealing(true);
    }, 150);

    // Begin upward curtain slide — gives 1.15s for reveal + ~250ms hold
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1550);

    // Fallback safety cleanup (tab-inactive / slow devices)
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setIsVisible(false);
    }, 2600);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current && e.propertyName === "transform" && isExiting) {
      document.body.style.overflow = "";
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      onTransitionEnd={handleTransitionEnd}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070707]"
      style={{
        transform: isExiting ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
        transition: "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        pointerEvents: isExiting ? "none" : "auto",
      }}
      aria-hidden="true"
    >
      {/* Wrapper: glides up + fades as the curtain lifts */}
      <div
        className="relative px-8"
        style={{
          transform: isExiting ? "translate3d(0, -45px, 0)" : "translate3d(0, 0, 0)",
          opacity: isExiting ? 0 : 1,
          transition: "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.55s ease",
          willChange: "transform, opacity",
        }}
      >
        {/*
          Overflow-hidden container acts as the reveal mask.
          The text itself never animates — only the sibling overlay slides away.
          This keeps the text on its own compositor layer, preventing any paint jank.
        */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <h1
            className="select-none text-center"
            style={{
              fontFamily: "var(--font-martel), 'Martel Sans', sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              color: "var(--foreground)",
              transform: "translate3d(0, 0, 0)",
              willChange: "auto",
            }}
          >
            Aniket&apos;s Portfolio
          </h1>

          {/* GPU-accelerated reveal mask: slides from right → off-screen left */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#070707",
              transform: isRevealing
                ? "translate3d(-101%, 0, 0)"
                : "translate3d(0, 0, 0)",
              transition: isRevealing
                ? "transform 1.15s cubic-bezier(0.76, 0, 0.24, 1)"
                : "none",
              willChange: "transform",
            }}
          />
        </div>
      </div>
    </div>
  );
}
