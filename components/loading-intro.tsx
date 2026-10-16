"use client";

import { useEffect, useRef, useState } from "react";

export default function LoadingIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // 1. Cleanly remove the static SSR overlay once client mounts
    const ssrOverlay = document.getElementById("loading-intro-ssr");
    if (ssrOverlay) {
      ssrOverlay.style.opacity = "0";
      setTimeout(() => ssrOverlay.remove(), 100);
    }

    // 2. Lock page scroll during the intro
    document.body.style.overflow = "hidden";

    // 3. Accessibility bypass for prefers-reduced-motion
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
    let holdTimer: ReturnType<typeof setTimeout> | null = null;

    const runSequence = async () => {
      // Ensure font is fully loaded so metrics never shift
      if (typeof document !== "undefined" && document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }

      if (isCancelled) return;

      const container = containerRef.current;
      const text = textRef.current;
      if (!container || !text) return;

      // Allow 1 RAF frame for initial DOM paint and GPU composite sync
      await new Promise((r) => requestAnimationFrame(r));
      if (isCancelled) return;

      // Unhide text container so WAAPI animation starts smoothly from darkness
      text.style.visibility = "visible";

      // ── Phase 1: Text emerges from darkness after link is opened ──────────
      // Starts fully hidden (clipPath: 100%, opacity: 0) and smoothly reveals
      wipeAnim = text.animate(
        [
          {
            clipPath: "inset(0 100% 0 0)",
            opacity: "0",
            transform: "translate3d(0, 16px, 0)",
          },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        ],
        {
          duration: 950,
          delay: 220, // Clean pause in complete darkness before text emerges
          easing: "cubic-bezier(0.16, 1, 0.3, 1)", // Silky Apple-style ease-out
          fill: "forwards",
        }
      );

      try {
        await wipeAnim.finished;
      } catch {
        if (isCancelled) return;
      }

      if (isCancelled) return;

      // ── Phase 2: Calm, satisfying hold on the revealed title ─────────────
      holdTimer = setTimeout(() => {
        if (isCancelled) return;

        // Disable pointer-events immediately as curtain starts lifting
        container.style.pointerEvents = "none";
        window.dispatchEvent(new CustomEvent("portfolio-intro-exit"));

        // ── Phase 3: Hardware-composited curtain lift ─────────────────────
        // Lifts the entire screen upwards without conflicting sub-transforms
        exitAnim = container.animate(
          [
            { transform: "translate3d(0, 0, 0)" },
            { transform: "translate3d(0, -100%, 0)" },
          ],
          {
            duration: 800,
            easing: "cubic-bezier(0.77, 0, 0.175, 1)", // Fluid in-out cubic
            fill: "forwards",
          }
        );

        exitAnim.onfinish = () => {
          document.body.style.overflow = "";
          setIsVisible(false);
          window.dispatchEvent(new CustomEvent("portfolio-intro-complete"));
        };
      }, 400);
    };

    runSequence();

    // Safety fallback
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setIsVisible(false);
      window.dispatchEvent(new CustomEvent("portfolio-intro-complete"));
    }, 3500);

    return () => {
      isCancelled = true;
      if (wipeAnim) wipeAnim.cancel();
      if (exitAnim) exitAnim.cancel();
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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black px-6 overflow-hidden select-none transform-gpu will-change-transform"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    >
      <div className="relative inline-block select-none overflow-hidden py-2 px-4">
        {/* 
          CRITICAL: Text starts completely invisible (opacity: 0, clipPath: 100%, visibility: hidden)
          so the user opens into pure clean blackness before the text gracefully appears.
        */}
        <h1
          ref={textRef}
          className="text-center font-light tracking-tight text-foreground select-none"
          style={{
            fontFamily: "var(--font-martel), 'Martel Sans', sans-serif",
            fontSize: "clamp(2rem, 6.5vw, 4.5rem)",
            lineHeight: 1.15,
            whiteSpace: "nowrap",
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
            visibility: "hidden",
            transform: "translate3d(0, 16px, 0)",
            willChange: "transform, clip-path, opacity",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          Aniket&apos;s Portfolio
        </h1>
      </div>
    </div>
  );
}
