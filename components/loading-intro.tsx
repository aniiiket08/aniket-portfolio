"use client";

import { useEffect, useRef, useState } from "react";

export default function LoadingIntro() {
  const [isVisible, setIsVisible] = useState(true);
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

    // Begin upward curtain slide at 1550ms (allows 1.1s reveal + 250ms hold)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1550);

    // Fallback safety cleanup in case transitionend event is deferred by tab inactivity
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setIsVisible(false);
    }, 2550);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    // Only dismiss once the outer container has fully completed its upward transform
    if (e.target === containerRef.current && e.propertyName === "transform" && isExiting) {
      document.body.style.overflow = "";
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Pure CSS keyframes — no React re-render, runs entirely on compositor */}
      <style>{`
        @keyframes loading-cover-wipe {
          0% { transform: scaleX(1) translateZ(0); }
          100% { transform: scaleX(0) translateZ(0); }
        }
      `}</style>
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
        {/* Text container with coordinated upward glide on curtain lift */}
        <div
          className="relative inline-block px-8"
          style={{
            transform: isExiting ? "translate3d(0, -45px, 0)" : "translate3d(0, 0, 0)",
            opacity: isExiting ? 0.3 : 1,
            transition: "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.7s ease",
            willChange: "transform, opacity",
            overflow: "hidden",
          }}
        >
          <h1
            className="select-none text-center"
            style={{
              fontFamily: "var(--font-martel), 'Martel Sans', sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              color: "var(--foreground)",
              transform: "translateZ(0)",
            }}
          >
            Aniket&apos;s Portfolio
          </h1>
          {/* Pure CSS animated cover — scaleX on compositor, zero main-thread work */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#070707",
              transformOrigin: "right center",
              animation: "loading-cover-wipe 1.1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s forwards",
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
        </div>
      </div>
    </>
  );
}

