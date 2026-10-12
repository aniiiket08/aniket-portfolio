"use client";

import { useEffect, useRef, useState } from "react";

export default function LoadingIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Cleanly remove the static SSR overlay from DOM
    const ssrOverlay = document.getElementById("loading-intro-ssr");
    if (ssrOverlay) {
      ssrOverlay.classList.add("hide");
      ssrOverlay.remove();
    }

    // Lock page scroll during the intro animation
    document.body.style.overflow = "hidden";

    // Hardware-accelerated Web Animations API wipe
    const cover = coverRef.current;
    let anim: Animation | null = null;
    if (cover) {
      anim = cover.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: "translate3d(100%, 0, 0)" },
        ],
        {
          duration: 1400,
          delay: 350,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        }
      );
    }

    // Begin upward curtain slide at 2000ms (0.35s initial black screen + 1.4s reveal + 0.25s hold)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // Fallback safety cleanup in case transitionend event is deferred by tab inactivity
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setIsVisible(false);
    }, 3000);

    return () => {
      anim?.cancel();
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
    <div
      ref={containerRef}
      onTransitionEnd={handleTransitionEnd}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070707] px-6 overflow-hidden"
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
        className="relative inline-block select-none"
        style={{
          transform: isExiting ? "translate3d(0, -45px, 0)" : "translate3d(0, 0, 0)",
          opacity: isExiting ? 0.3 : 1,
          transition: "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.7s ease",
          willChange: "transform, opacity",
        }}
      >
        <h1
          className="text-center"
          style={{
            fontFamily: "var(--font-martel), 'Martel Sans', sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 300,
            letterSpacing: "-0.015em",
            lineHeight: 1.2,
            color: "var(--foreground)",
            whiteSpace: "nowrap",
            transform: "translateZ(0)",
          }}
        >
          Aniket&apos;s Portfolio
        </h1>

        {/* 
          GPU-composited feathered cover:
          - Starts covering the text completely with solid #070707
          - 48px soft feathered leading gradient prevents jagged subpixel text strobing
          - No parent overflow:hidden clipping ensures zero CPU rasterization on low-end devices
        */}
        <div
          ref={coverRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-8px",
            bottom: "-8px",
            left: "-48px",
            right: "-24px",
            background:
              "linear-gradient(to right, rgba(7, 7, 7, 0) 0%, #070707 48px, #070707 100%)",
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}


