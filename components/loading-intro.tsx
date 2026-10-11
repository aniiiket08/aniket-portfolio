"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-intro-seen";

export default function LoadingIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Hide SSR overlay immediately when component mounts
    const ssrOverlay = document.getElementById("loading-intro-ssr");
    if (ssrOverlay) {
      ssrOverlay.classList.add("hide");
    }

    // Check if user has seen intro this session
    const hasSeenIntro = sessionStorage.getItem(STORAGE_KEY);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasSeenIntro || prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);
      return;
    }

    // Prevent scroll during intro
    document.body.style.overflow = "hidden";

    // Start text reveal after 300ms delay
    const revealTimer = setTimeout(() => {
      setIsRevealing(true);
    }, 300);

    // Start exit transition at 2.4s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2400);

    // Complete removal at 3.0s
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "true");
      document.body.style.overflow = "";
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070707]"
      style={{
        // translate3d (not translateY+translateZ) guarantees a 3D rendering context
        // in all browsers. backfaceVisibility:hidden locks the element to its own
        // GPU compositor layer from mount — no late promotion, no stutter on any device.
        transform: isExiting ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
        transition: isExiting ? "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      {/* clip-path reveal: GPU-composited on all modern browsers.
          mask-size was CPU-painted on every frame, causing jank on low-end devices. */}
      <div className="relative inline-block px-8">
        <h1
          className="select-none text-center"
          style={{
            fontFamily: "var(--font-martel), 'Martel Sans', sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 300,
            letterSpacing: "-0.015em",
            lineHeight: 1.2,
            color: "var(--foreground)",
            // inset(0 100% 0 0) = fully clipped from right → inset(0 0% 0 0) = fully visible
            clipPath: isRevealing ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transition: isRevealing
              ? "clip-path 1.5s cubic-bezier(0.33, 0, 0.2, 1)"
              : "none",
            willChange: "clip-path",
          }}
        >
          Aniket&apos;s Portfolio
        </h1>
      </div>
    </div>
  );
}
