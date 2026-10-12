"use client";

import { useEffect, useRef, useState } from "react";

export default function LoadingIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
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

    // Fast-path for users who prefer reduced motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.body.style.overflow = "";
      setIsVisible(false);
      window.dispatchEvent(new CustomEvent("portfolio-intro-complete"));
      return;
    }

    let isCancelled = false;
    let wipeAnim: Animation | null = null;
    let exitAnim: Animation | null = null;
    let textAnim: Animation | null = null;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;

    const runSequence = async () => {
      // Ensure fonts are ready before animating so text metrics don't shift mid-wipe
      if (typeof document !== "undefined" && document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }

      if (isCancelled) return;

      const cover = coverRef.current;
      const container = containerRef.current;
      const textContainer = textContainerRef.current;

      if (!cover || !container || !textContainer) return;

      // Phase 1: Silky-smooth compositor-driven text wipe
      wipeAnim = cover.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: "translate3d(100%, 0, 0)" },
        ],
        {
          duration: 1300,
          delay: 260,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );

      try {
        await wipeAnim.finished;
      } catch {
        if (isCancelled) return;
      }

      if (isCancelled) return;

      // Phase 2: Brief satisfying hold on the fully revealed text
      holdTimer = setTimeout(() => {
        if (isCancelled) return;

        // Signal background systems to prepare for reveal
        window.dispatchEvent(new CustomEvent("portfolio-intro-exit"));

        // Disable pointer events immediately as curtain begins lifting
        container.style.pointerEvents = "none";

        // Phase 3: Hardware-composited upward curtain lift
        exitAnim = container.animate(
          [
            { transform: "translate3d(0, 0, 0)" },
            { transform: "translate3d(0, -100%, 0)" },
          ],
          {
            duration: 850,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards",
          }
        );

        // Coordinated upward glide and soft fade on text
        textAnim = textContainer.animate(
          [
            { transform: "translate3d(0, 0, 0)", opacity: "1" },
            { transform: "translate3d(0, -45px, 0)", opacity: "0.2" },
          ],
          {
            duration: 800,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "forwards",
          }
        );

        exitAnim.onfinish = () => {
          document.body.style.overflow = "";
          setIsVisible(false);
          window.dispatchEvent(new CustomEvent("portfolio-intro-complete"));
        };
      }, 240);
    };

    runSequence();

    // Fallback safety cleanup in case tab is backgrounded
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setIsVisible(false);
      window.dispatchEvent(new CustomEvent("portfolio-intro-complete"));
    }, 3200);

    return () => {
      isCancelled = true;
      if (wipeAnim) wipeAnim.cancel();
      if (exitAnim) exitAnim.cancel();
      if (textAnim) textAnim.cancel();
      if (holdTimer) clearTimeout(holdTimer);
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070707] px-6 overflow-hidden select-none"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        contain: "paint",
        isolation: "isolate",
      }}
      aria-hidden="true"
    >
      {/* Text container with coordinated upward glide on curtain lift */}
      <div
        ref={textContainerRef}
        className="relative inline-block select-none"
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          contain: "layout paint",
        }}
      >
        <h1
          className="text-center"
          style={{
            fontFamily: "var(--font-martel), 'Martel Sans', sans-serif",
            fontSize: "clamp(1.85rem, 6.5vw, 4.75rem)",
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
            transform: "translate3d(0, 0, 0)",
          }}
        />
      </div>
    </div>
  );
}


