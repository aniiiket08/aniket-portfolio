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
        transform: isExiting ? "translateY(-100%)" : "translateY(0)",
        transition: isExiting ? "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
      }}
      aria-hidden="true"
    >
      {/* Text with progressive left-to-right reveal using mask */}
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
            WebkitMaskImage: isRevealing 
              ? "linear-gradient(to right, black 0%, black 100%)"
              : "linear-gradient(to right, black 0%, black 0%, transparent 0%)",
            maskImage: isRevealing
              ? "linear-gradient(to right, black 0%, black 100%)"
              : "linear-gradient(to right, black 0%, black 0%, transparent 0%)",
            WebkitMaskSize: isRevealing ? "100% 100%" : "0% 100%",
            maskSize: isRevealing ? "100% 100%" : "0% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "left center",
            maskPosition: "left center",
            transition: isRevealing 
              ? "mask-size 1.5s cubic-bezier(0.33, 0, 0.2, 1), -webkit-mask-size 1.5s cubic-bezier(0.33, 0, 0.2, 1)" 
              : "none",
            willChange: isRevealing ? "mask-size, -webkit-mask-size" : "auto",
          }}
        >
          Aniket's Portfolio
        </h1>
      </div>
    </div>
  );
}
